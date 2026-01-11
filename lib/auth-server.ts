import { cookies } from 'next/headers';
import { validateSession } from './auth';

/**
 * Get the current authenticated admin from server components
 * Returns null if not authenticated
 */
export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const session = await validateSession(token);
    return session;
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}

/**
 * Require authentication in server components
 * Throws an error if not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}

/**
 * Get current admin or throw error
 */
export async function getCurrentAdmin() {
  const session = await requireAuth();
  return session.admin;
}

