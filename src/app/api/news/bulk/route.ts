import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireEditorOrAdmin } from '@/lib/auth';

export async function PATCH(req: Request) {
  try {
    await requireEditorOrAdmin();

    const body = await req.json();
    const { ids, action } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Интихоби хабарҳо лозим аст' }, { status: 400 });
    }

    const placeholders = ids.map(() => '?').join(',');

    if (action === 'publish') {
      db.prepare(`
        UPDATE news
        SET status = 'published', published_at = COALESCE(published_at, CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP
        WHERE id IN (${placeholders})
      `).run(...ids);
      return NextResponse.json({ message: 'Хабарҳо муваффақона нашр шуданд.' });
    } else if (action === 'unpublish') {
      db.prepare(`
        UPDATE news
        SET status = 'draft', updated_at = CURRENT_TIMESTAMP
        WHERE id IN (${placeholders})
      `).run(...ids);
      return NextResponse.json({ message: 'Хабарҳо ба сифати пешнавис сабт шуданд.' });
    } else if (action === 'delete') {
      db.prepare(`DELETE FROM news WHERE id IN (${placeholders})`).run(...ids);
      return NextResponse.json({ message: 'Хабарҳо муваффақона нест карда шуданд.' });
    }

    return NextResponse.json({ error: 'Амалиёти номаълум' }, { status: 400 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: '401' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: '403' }, { status: 403 });
    return NextResponse.json({ error: 'Хатогӣ' }, { status: 500 });
  }
}
