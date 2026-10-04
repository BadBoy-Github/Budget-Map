import { NextResponse } from 'next/server';

// POST /api/auth/logout
export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('POST /api/auth/logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}