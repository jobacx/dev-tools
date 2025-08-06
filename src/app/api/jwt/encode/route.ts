import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { payload, secret, algorithm = 'HS256', expiresIn } = await request.json();

    if (!payload || !secret) {
      return NextResponse.json(
        { error: 'Both payload and secret are required' },
        { status: 400 }
      );
    }

    let parsedPayload;
    try {
      parsedPayload = typeof payload === 'string' ? JSON.parse(payload) : payload;
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const options: any = { algorithm };
    if (expiresIn) {
      options.expiresIn = expiresIn;
    }

    const token = jwt.sign(parsedPayload, secret, options);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('JWT encoding error:', error);
    return NextResponse.json(
      { error: 'Failed to generate JWT' },
      { status: 500 }
    );
  }
}
