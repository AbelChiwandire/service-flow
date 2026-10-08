import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function getSessionUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

// For pages and server components: redirects to the login page when signed out.
export async function requireUserId(): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');
  return userId;
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}
