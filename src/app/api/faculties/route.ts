import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireEditorOrAdmin } from '@/lib/auth';
import { facultySchema } from '@/lib/validations';

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
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const faculties = db
      .prepare(`SELECT * FROM faculties ${whereClause} ORDER BY display_order ASC, name ASC`)
      .all(...params);

    return NextResponse.json({ data: faculties });
  } catch (error) {
    return NextResponse.json({ error: 'Хатогӣ ҳангоми гирифтани факултетҳо' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireEditorOrAdmin();

    const body = await req.json();
    const result = facultySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Маълумоти нодуруст', details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, slug, description, image, phone, email, head, display_order, status } = result.data;

    const existing = db.prepare('SELECT id FROM faculties WHERE slug = ?').get(slug);
    if (existing) {
      return NextResponse.json({ error: 'Инкишофи slug аллакай мавҷуд аст' }, { status: 409 });
    }

    const insert = db.prepare(`
      INSERT INTO faculties (name, slug, description, image, phone, email, head, display_order, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const res = insert.run(
      name,
      slug,
      description,
      image || null,
      phone || null,
      email || null,
      head || null,
      display_order || 0,
      status
    );

    const created = db.prepare('SELECT * FROM faculties WHERE id = ?').get(res.lastInsertRowid);

    return NextResponse.json({ message: 'Факултет бомуваффақият илова шуд.', data: created }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}
