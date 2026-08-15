import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { userCreateSchema } from '@/lib/validations';

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const users = db
      .prepare(`
        SELECT id, email, name, role, status, must_change_password, created_at, updated_at, last_login_at
        FROM users
        ${whereClause}
        ORDER BY created_at DESC
      `)
      .all(...params);

    return NextResponse.json({ data: users });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Воридшавӣ лозим аст' }, { status: 401 });
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Барои дастрасӣ ба ин бахш ҳуқуқи Администратор лозим аст' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Хатогӣ ҳангоми гирифтани корбарон' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const result = userCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Маълумоти нодуруст', details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, password, name, role, status } = result.data;

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'Корбар бо ин емейл аллакай мавҷуд аст' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insert = db.prepare(`
      INSERT INTO users (email, password, name, role, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const res = insert.run(email, passwordHash, name, role, status);

    const created = db.prepare(`
      SELECT id, email, name, role, status, created_at, updated_at
      FROM users WHERE id = ?
    `).get(res.lastInsertRowid);

    return NextResponse.json({ message: 'Корбар муваффақона сохта шуд.', data: created }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403 Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}
