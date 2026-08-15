import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ message: 'Муваффақона баромад шуд' });
  } catch (error) {
    return NextResponse.json({ error: 'Хатогӣ ҳангоми баромад' }, { status: 500 });
  }
}
