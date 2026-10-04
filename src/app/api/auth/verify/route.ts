import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';

// GET /api/auth/verify - verify the current user from the JWT token
export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = verifyJwt(token);

  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    },
  });
}