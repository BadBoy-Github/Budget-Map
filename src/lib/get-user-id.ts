import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';

export function getUserIdFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get('auth-token')?.value;
  if (!token) return null;
  const payload = verifyJwt(token);
  if (!payload) return null;
  return payload.userId;
}