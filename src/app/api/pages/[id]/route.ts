import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireEditorOrAdmin, getSession } from '@/lib/auth';
import { pageSchema } from '@/lib/validations';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    const query = isNumeric
      ? 'SELECT * FROM pages WHERE id = ?'
      : 'SELECT * FROM pages WHERE slug = ?';

    const item = db.prepare(query).get(id);

    if (!item) {
      return NextResponse.json({ error: 'Саҳифа ёфт нашуд' }, { status: 404 });
    }

    const session = await getSession();
    if ((item as any).status !== 'published' && !session) {
      return NextResponse.json({ error: 'Саҳифа ёфт нашуд' }, { status: 404 });
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

    const existing = db.prepare('SELECT * FROM pages WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Саҳифа ёфт нашуд' }, { status: 404 });
    }

    const body = await req.json();
    const result = pageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Маълумоти нодуруст', details: result.error.format() },
        { status: 400 }
      );
    }

    const { title, slug, content, featured_image, seo_title, seo_description, status } = result.data;

    const slugCheck = db.prepare('SELECT id FROM pages WHERE slug = ? AND id != ?').get(slug, id);
    if (slugCheck) {
      return NextResponse.json({ error: 'Slug аллакай мавҷуд аст' }, { status: 409 });
    }

    const update = db.prepare(`
      UPDATE pages
      SET title = ?, slug = ?, content = ?, featured_image = ?, seo_title = ?, seo_description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      title,
      slug,
      content,
      featured_image || null,
      seo_title || null,
      seo_description || null,
      status,
      id
    );

    const updated = db.prepare('SELECT * FROM pages WHERE id = ?').get(id);

    return NextResponse.json({ message: 'Саҳифа муваффақона нав шуд.', data: updated });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireEditorOrAdmin();
    const { id } = await params;

    const existing = db.prepare('SELECT id FROM pages WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Саҳифа ёфт нашуд' }, { status: 404 });
    }

    db.prepare('DELETE FROM pages WHERE id = ?').run(id);

    return NextResponse.json({ message: 'Саҳифа нест карда шуд.' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}
