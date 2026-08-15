import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireEditorOrAdmin } from '@/lib/auth';
import { facultySchema } from '@/lib/validations';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    const query = isNumeric
      ? 'SELECT * FROM faculties WHERE id = ?'
      : 'SELECT * FROM faculties WHERE slug = ?';

    const item = db.prepare(query).get(id);

    if (!item) {
      return NextResponse.json({ error: 'Факултет ёфт нашуд' }, { status: 404 });
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

    const existing = db.prepare('SELECT * FROM faculties WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Факултет ёфт нашуд' }, { status: 404 });
    }

    const body = await req.json();
    const result = facultySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Маълумоти нодуруст', details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, slug, description, image, phone, email, head, display_order, status } = result.data;

    const slugCheck = db.prepare('SELECT id FROM faculties WHERE slug = ? AND id != ?').get(slug, id);
    if (slugCheck) {
      return NextResponse.json({ error: 'Slug аллакай мавҷуд аст' }, { status: 409 });
    }

    const update = db.prepare(`
      UPDATE faculties
      SET name = ?, slug = ?, description = ?, image = ?, phone = ?, email = ?, head = ?, display_order = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      name,
      slug,
      description,
      image || null,
      phone || null,
      email || null,
      head || null,
      display_order || 0,
      status,
      id
    );

    const updated = db.prepare('SELECT * FROM faculties WHERE id = ?').get(id);

    return NextResponse.json({ message: 'Факултет муваффақона нав карда шуд.', data: updated });
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

    const existing = db.prepare('SELECT id FROM faculties WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Факултет ёфт нашуд' }, { status: 404 });
    }

    db.prepare('DELETE FROM faculties WHERE id = ?').run(id);

    return NextResponse.json({ message: 'Факултет нест карда шуд.' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}
