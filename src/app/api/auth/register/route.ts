import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/lib/models/User';
import { hashPassword, signJwt, generateUserId } from '@/lib/auth';

// POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Generate unique 13-digit alphanumeric userId
    let userId = generateUserId();
    let attempts = 0;
    while (await UserModel.findOne({ userId }) && attempts < 5) {
      userId = generateUserId();
      attempts++;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await UserModel.create({
      userId,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name,
    });

    // Create token
    const token = signJwt({ userId: user.userId, email: user.email, name: user.name });

    const response = NextResponse.json({
      user: {
        id: user._id!.toString(),
        userId: user.userId,
        email: user.email,
        name: user.name,
      }
    }, { status: 201 });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}