import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { userUpdateSchema } from '@/lib/validations';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const user = db
      .prepare('SELECT id, email, name, role, status, must_change_password, created_at, updated_at, last_login_at FROM users WHERE id = ?')
      .get(id);

    if (!user) {
      return NextResponse.json({ error: 'Корбар ёфт нашуд' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403 Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminSession = await requireAdmin();
    const { id } = await params;

    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    if (!existing) {
      return NextResponse.json({ error: 'Корбар ёфт нашуд' }, { status: 404 });
    }

    const body = await req.json();
    const result = userUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Маълумоти нодуруст', details: result.error.format() }, { status: 400 });
    }

    const { email, password, name, role, status } = result.data;

    if (email && email !== existing.email) {
      const emailCheck = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id);
      if (emailCheck) {
        return NextResponse.json({ error: 'Ин емейл аллакай истифода мешавад' }, { status: 409 });
      }
    }

    if (parseInt(id, 10) === adminSession.id && status === 'inactive') {
      return NextResponse.json({ error: 'Шумо наметавонед аккаунти худро ғайрифаъол созед' }, { status: 400 });
    }

    let passwordHash = existing.password;
    if (password && password.trim().length >= 8) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const update = db.prepare(`
      UPDATE users
      SET email = ?, password = ?, name = ?, role = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      email || existing.email,
      passwordHash,
      name || existing.name,
      role || existing.role,
      status || existing.status,
      id
    );

    const updatedUser = db
      .prepare('SELECT id, email, name, role, status, created_at, updated_at FROM users WHERE id = ?')
      .get(id);

    return NextResponse.json({ message: 'Маълумоти корбар нав карда шуд.', data: updatedUser });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403 Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminSession = await requireAdmin();
    const { id } = await params;

    if (parseInt(id, 10) === adminSession.id) {
      return NextResponse.json({ error: 'Шумо наметавонед аккаунти худро нест кунед' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Корбар ёфт нашуд' }, { status: 404 });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    return NextResponse.json({ message: 'Корбар муваффақона нест карда шуд.' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403 Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}
