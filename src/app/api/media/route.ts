import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { db } from '@/lib/db';
import { requireEditorOrAdmin } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (search) {
      whereClause += ' AND (original_name LIKE ? OR filename LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const totalRow = db
      .prepare(`SELECT COUNT(*) as count FROM media ${whereClause}`)
      .get(...params) as { count: number };

    const files = db
      .prepare(`
        SELECT m.*, u.name as uploader_name
        FROM media m
        LEFT JOIN users u ON m.uploaded_by = u.id
        ${whereClause}
        ORDER BY m.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .all(...params, limit, offset);

    return NextResponse.json({
      data: files,
      pagination: {
        page,
        limit,
        total: totalRow.count,
        totalPages: Math.ceil(totalRow.count / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Хатогӣ ҳангоми гирифтани файлҳо' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireEditorOrAdmin();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Файл интихоб نشده аст' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Формати файл дастгирӣ намешавад.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Андозаи файл бояд аз 10МБ камтар бошад.' }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.name).toLowerCase() || '.bin';
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(UPLOAD_DIR, safeFilename);

    if (!filePath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json({ error: 'Муроҷиати ғайриқонунӣ ба директория' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    const insert = db.prepare(`
      INSERT INTO media (filename, original_name, url, mime_type, size, uploaded_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const res = insert.run(
      safeFilename,
      file.name,
      publicUrl,
      file.type,
      file.size,
      session.id
    );

    const created = db.prepare('SELECT * FROM media WHERE id = ?').get(res.lastInsertRowid);

    return NextResponse.json({ message: 'Файл бомуваффақият боргузорӣ шуд.', data: created }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ ҳангоми боргузорӣ' }, { status: 500 });
  }
}
