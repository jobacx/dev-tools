import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { password, hash } = await request.json();

    if (!password || !hash) {
      return NextResponse.json(
        { error: 'Both password and hash are required' },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, hash);

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error('Bcrypt verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify hash' },
      { status: 500 }
    );
  }
}
