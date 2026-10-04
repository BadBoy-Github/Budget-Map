import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
export const JWT_EXPIRES_IN = '7d';

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const USERID_LENGTH = 13;

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  checks: string[];
}

export function generateUserId(): string {
  let result = '';
  for (let i = 0; i < USERID_LENGTH; i++) {
    result += ALPHANUMERIC.charAt(Math.floor(Math.random() * ALPHANUMERIC.length));
  }
  return result;
}

// Password strength evaluation
export function evaluatePassword(password: string): PasswordStrength {
  const checks: string[] = [];
  let score = 0;

  if (password.length >= 6) {
    checks.push('At least 6 characters');
    score++;
  }
  if (password.length >= 8) {
    checks.push('At least 8 characters');
    score++;
  }
  if (/(?=.*[a-z])/.test(password) && /(?=.*[A-Z])/.test(password)) {
    checks.push('Contains uppercase and lowercase letters');
    score++;
  }
  if (/\d/.test(password)) {
    checks.push('Contains a number');
    score++;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    checks.push('Contains a special character');
    score++;
  }

  let label = 'Weak';
  if (score >= 4) label = 'Strong';
  else if (score >= 3) label = 'Good';
  else if (score >= 2) label = 'Fair';

  return { score, label, checks };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function signJwt(payload: object, expiresIn?: string): string {
  const options: SignOptions = {};
  if (expiresIn) {
    options.expiresIn = expiresIn as StringValue;
  } else {
    options.expiresIn = JWT_EXPIRES_IN as StringValue;
  }
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt(token: string): { userId: string; email: string; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };
  } catch {
    return null;
  }
}