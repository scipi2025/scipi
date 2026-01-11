import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Validate session
    const session = await validateSession(token);

    if (!session) {
      // Invalid or expired session
      const response = NextResponse.json(
        { error: 'Session expired or invalid' },
        { status: 401 }
      );
      response.cookies.delete('auth-token');
      return response;
    }

    return NextResponse.json({
      success: true,
      admin: session.admin,
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

