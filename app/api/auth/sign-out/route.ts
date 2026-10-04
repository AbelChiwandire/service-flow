import { NextResponse } from 'next/server';
import { auth, signOut } from '@/auth';

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  await signOut({ redirect: false });
  return NextResponse.json({ success: true });
}
