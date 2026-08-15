import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireEditorOrAdmin, getSession } from '@/lib/auth';
import { newsSchema } from '@/lib/validations';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    const query = isNumeric
      ? 'SELECT n.*, u.name as author_name FROM news n LEFT JOIN users u ON n.author_id = u.id WHERE n.id = ?'
      : 'SELECT n.*, u.name as author_name FROM news n LEFT JOIN users u ON n.author_id = u.id WHERE n.slug = ?';

    const item = db.prepare(query).get(id);

    if (!item) {
      return NextResponse.json({ error: 'Хабар ёфт нашуд' }, { status: 404 });
    }

    const session = await getSession();
    if ((item as any).status !== 'published' && !session) {
      return NextResponse.json({ error: 'Хабар ёфт нашуд' }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  } catch (error) {
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireEditorOrAdmin();
    const { id } = await params;

    const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(id) as any;
    if (!existing) {
      return NextResponse.json({ error: 'Хабар ёфт нашуд' }, { status: 404 });
    }

    const body = await req.json();
    const result = newsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Маълумоти нодуруст', details: result.error.format() },
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

    const slugCheck = db.prepare('SELECT id FROM news WHERE slug = ? AND id != ?').get(slug, id);
    if (slugCheck) {
      return NextResponse.json({ error: 'Инкишофи slug аллакай мавҷуд аст' }, { status: 409 });
    }

    let publishedAt = existing.published_at;
    if (status === 'published' && !publishedAt) {
      publishedAt = new Date().toISOString();
    }

    const update = db.prepare(`
      UPDATE news
      SET title = ?, slug = ?, summary = ?, content = ?, featured_image = ?, category = ?, status = ?, is_featured = ?, seo_title = ?, seo_description = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      title,
      slug,
      summary || null,
      content,
      featured_image || null,
      category,
      status,
      is_featured ? 1 : 0,
      seo_title || null,
      seo_description || null,
      publishedAt,
      id
    );

    const updatedItem = db.prepare('SELECT * FROM news WHERE id = ?').get(id);

    return NextResponse.json({ message: 'Новость успешно сохранена.', data: updatedItem });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ ҳангоми навсозӣ' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireEditorOrAdmin();
    const { id } = await params;

    const existing = db.prepare('SELECT id FROM news WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Хабар ёфт нашуд' }, { status: 404 });
    }

    db.prepare('DELETE FROM news WHERE id = ?').run(id);

    return NextResponse.json({ message: 'Новость успешно удалена.' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ ҳангоми несткунӣ' }, { status: 500 });
  }
}
