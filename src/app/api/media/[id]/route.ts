import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { db } from '@/lib/db';
import { requireEditorOrAdmin } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireEditorOrAdmin();
    const { id } = await params;

    const media = db.prepare('SELECT * FROM media WHERE id = ?').get(id) as {
      id: number;
      filename: string;
      url: string;
    } | undefined;

    if (!media) {
      return NextResponse.json({ error: 'Файл ёфт нашуд' }, { status: 404 });
    }

    const filePath = path.join(UPLOAD_DIR, media.filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn('Physical file delete warning:', err);
    }

    db.prepare('DELETE FROM media WHERE id = ?').run(id);

    return NextResponse.json({ message: 'Файл муваффақона нест карда шуд.' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}
