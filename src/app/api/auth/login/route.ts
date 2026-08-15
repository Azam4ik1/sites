import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSessionToken, setSessionCookie } from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = checkRateLimit(ip);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Кӯшишҳои зиёди воридшавӣ. Баъди ${rate.resetInSec} сония боз кӯшиш кунед.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Маълумоти воридшуда нодуруст аст', details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as {
      id: number;
      email: string;
      password: string;
      name: string;
      role: 'admin' | 'editor' | 'employee';
      status: string;
      must_change_password: number;
    } | undefined;

    if (!user || user.status !== 'active') {
      return NextResponse.json({ error: 'Емейл ё парол нодуруст аст' }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Емейл ё парол нодуруст аст' }, { status: 401 });
    }

    resetRateLimit(ip);
    db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    const sessionPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      must_change_password: Boolean(user.must_change_password),
    };

    const token = await createSessionToken(sessionPayload);
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Хатои дохилии сервер' }, { status: 500 });
  }
}
