import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireEditorOrAdmin, getSession } from '@/lib/auth';
import { newsSchema } from '@/lib/validations';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    const session = await getSession();
    if (!session && !status) {
      whereClause += " AND n.status = 'published'";
    } else if (status) {
      whereClause += ' AND n.status = ?';
      params.push(status);
    }

    if (category) {
      whereClause += ' AND n.category = ?';
      params.push(category);
    }

    if (featured === 'true') {
      whereClause += ' AND n.is_featured = 1';
    }

    if (search) {
      whereClause += ' AND (n.title LIKE ? OR n.summary LIKE ? OR n.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const totalRow = db
      .prepare(`SELECT COUNT(*) as count FROM news n ${whereClause}`)
      .get(...params) as { count: number };

    const newsList = db
      .prepare(`
        SELECT n.*, u.name as author_name
        FROM news n
        LEFT JOIN users u ON n.author_id = u.id
        ${whereClause}
        ORDER BY n.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .all(...params, limit, offset);

    return NextResponse.json({
      data: newsList,
      pagination: {
        page,
        limit,
        total: totalRow.count,
        totalPages: Math.ceil(totalRow.count / limit),
      },
    });
  } catch (error) {
    console.error('Fetch news error:', error);
    return NextResponse.json({ error: 'Хатогӣ ҳангоми гирифтани ахбор' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireEditorOrAdmin();

    const body = await req.json();
    const result = newsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Маълумоти воридшуда нодуруст аст', details: result.error.format() },
        { status: 400 }
      );
    }

    const {
      title,
      slug,
      summary,
      content,
      featured_image,
      category,
      status,
      is_featured,
      seo_title,
      seo_description,
    } = result.data;

    const existing = db.prepare('SELECT id FROM news WHERE slug = ?').get(slug);
    if (existing) {
      return NextResponse.json({ error: 'Инкишофи slug аллакай мавҷуд аст' }, { status: 409 });
    }

    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    const insert = db.prepare(`
      INSERT INTO news (title, slug, summary, content, featured_image, category, author_id, status, is_featured, seo_title, seo_description, published_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const res = insert.run(
      title,
      slug,
      summary || null,
      content,
      featured_image || null,
      category || 'Ахбор',
      session.id,
      status,
      is_featured ? 1 : 0,
      seo_title || null,
      seo_description || null,
      publishedAt
    );

    const createdItem = db.prepare('SELECT * FROM news WHERE id = ?').get(res.lastInsertRowid);

    return NextResponse.json({ message: 'Новость успешно сохранена.', data: createdItem }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Воридшавӣ лозим аст' }, { status: 401 });
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Рад карда шуд' }, { status: 403 });
    }
    console.error('Create news error:', error);
    return NextResponse.json({ error: 'Хатогӣ ҳангоми сохтани хабар' }, { status: 500 });
  }
}
