import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { settingsSchema } from '@/lib/validations';

export async function GET() {
  try {
    const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
    const settingsObject: Record<string, string> = {};
    for (const row of rows) {
      settingsObject[row.key] = row.value;
    }
    return NextResponse.json({ data: settingsObject });
  } catch (error) {
    return NextResponse.json({ error: 'Хатогӣ ҳангоми гирифтани танзимот' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const result = settingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Маълумоти танзимот нодуруст аст' }, { status: 400 });
    }

    const settingsData = result.data;
    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');

    const transaction = db.transaction((data: Record<string, string>) => {
      for (const [key, value] of Object.entries(data)) {
        upsert.run(key, value);
      }
    });

    transaction(settingsData);

    return NextResponse.json({ message: 'Настройки успешно обновлены.' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403 Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ ҳангоми навсозии танзимот' }, { status: 500 });
  }
}
