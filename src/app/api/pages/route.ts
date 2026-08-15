import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireEditorOrAdmin } from '@/lib/auth';
import { pageSchema } from '@/lib/validations';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const pages = db
      .prepare(`SELECT * FROM pages ${whereClause} ORDER BY created_at DESC`)
      .all(...params);

    return NextResponse.json({ data: pages });
  } catch (error) {
    return NextResponse.json({ error: 'Хатогӣ ҳангоми гирифтани саҳифаҳо' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireEditorOrAdmin();

    const body = await req.json();
    const result = pageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Маълумоти нодуруст', details: result.error.format() },
        { status: 400 }
      );
    }

    const { title, slug, content, featured_image, seo_title, seo_description, status } = result.data;

    const existing = db.prepare('SELECT id FROM pages WHERE slug = ?').get(slug);
    if (existing) {
      return NextResponse.json({ error: 'Slug аллакай мавҷуд аст' }, { status: 409 });
    }

    const insert = db.prepare(`
      INSERT INTO pages (title, slug, content, featured_image, seo_title, seo_description, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const res = insert.run(
      title,
      slug,
      content,
      featured_image || null,
      seo_title || null,
      seo_description || null,
      status
    );

    const created = db.prepare('SELECT * FROM pages WHERE id = ?').get(res.lastInsertRowid);

    return NextResponse.json({ message: 'Саҳифа илова шуд.', data: created }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}
