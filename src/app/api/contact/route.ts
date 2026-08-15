import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireEditorOrAdmin } from '@/lib/auth';
import { contactSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Маълумоти воридшуда нодуруст аст', details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;

    const insert = db.prepare(`
      INSERT INTO contact_messages (name, email, phone, subject, message, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    insert.run(name, email, phone || null, subject || null, message);

    return NextResponse.json({ message: 'Паёми шумо бомуваффақият фиристода шуд!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Хатогӣ ҳангоми фиристодани паём' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await requireEditorOrAdmin();

    const messages = db
      .prepare('SELECT * FROM contact_messages ORDER BY created_at DESC')
      .all();

    return NextResponse.json({ data: messages });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}
