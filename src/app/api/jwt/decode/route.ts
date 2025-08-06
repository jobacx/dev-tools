import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { token, secret } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'JWT token is required' },
        { status: 400 }
      );
    }

    // Decode without verification first to show structure
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid JWT format' },
        { status: 400 }
      );
    }

    const response: {
      header: jwt.JwtHeader;
      payload: string | jwt.JwtPayload | null;
      verified: boolean;
      verificationError?: string;
    } = {
      header: decoded.header,
      payload: decoded.payload,
      verified: false
    };

    // If secret is provided, verify the token
    if (secret) {
      try {
        jwt.verify(token, secret);
        response.verified = true;
      } catch {
        response.verified = false;
        response.verificationError = 'Invalid signature';
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('JWT decoding error:', error);
    return NextResponse.json(
      { error: 'Failed to decode JWT' },
      { status: 500 }
    );
  }
}
