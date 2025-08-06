import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { password, saltRounds = 10 } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(parseInt(saltRounds.toString()));
    const hash = await bcrypt.hash(password, salt);

    return NextResponse.json({ hash });
  } catch (error) {
    console.error('Bcrypt hashing error:', error);
    return NextResponse.json(
      { error: 'Failed to generate hash' },
      { status: 500 }
    );
  }
}
