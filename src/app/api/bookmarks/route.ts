import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bookmarks')
    .select('hobby_id')
    .eq('user_id', session.user.id);

  if (error) {
    console.error('[GET /api/bookmarks] Supabase error:', error.message);
    return NextResponse.json({ error: 'Failed to load bookmarks' }, { status: 500 });
  }

  const hobbyIds = (data ?? []).map((row) => row.hobby_id as string);

  return NextResponse.json({ hobbyIds });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { hobbyId } = await req.json();

  if (!hobbyId || typeof hobbyId !== 'string') {
    return NextResponse.json({ error: 'Invalid hobbyId' }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase.from('bookmarks').upsert(
    {
      user_id: session.user.id,
      hobby_id: hobbyId,
    },
    { onConflict: 'user_id,hobby_id' },
  );

  if (error) {
    console.error('[POST /api/bookmarks] Supabase error:', error.message);
    return NextResponse.json({ error: 'Failed to add bookmark' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { hobbyId } = await req.json();

  if (!hobbyId || typeof hobbyId !== 'string') {
    return NextResponse.json({ error: 'Invalid hobbyId' }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', session.user.id)
    .eq('hobby_id', hobbyId);

  if (error) {
    console.error('[DELETE /api/bookmarks] Supabase error:', error.message);
    return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

