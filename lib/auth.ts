import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_EXPIRY = '7d'; // 7 days

export interface JWTPayload {
  adminId: string;
  email: string;
  sessionId: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for an admin user
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Create a new session for an admin user
 */
export async function createSession(adminId: string, email: string) {
  // Calculate expiration date (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Create session record first
  const session = await prisma.session.create({
    data: {
      adminId,
      token: '', // Temporary placeholder
      expiresAt,
    },
  });

  // Generate JWT token with session ID
  const token = generateToken({
    adminId,
    email,
    sessionId: session.id,
  });

  // Update session with actual token
  await prisma.session.update({
    where: { id: session.id },
    data: { token },
  });

  return { token, expiresAt };
}

/**
 * Validate a session token
 */
export async function validateSession(token: string) {
  // Verify JWT token
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  // Check if session exists and is not expired
  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      admin: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    // Delete expired session
    await prisma.session.delete({
      where: { id: session.id },
    });
    return null;
  }

  return {
    admin: session.admin,
    sessionId: session.id,
  };
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(token: string) {
  try {
    await prisma.session.delete({
      where: { token },
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Delete all expired sessions (cleanup utility)
 */
export async function cleanupExpiredSessions() {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return result.count;
}

/**
 * Authenticate an admin user with email and password
 */
export async function authenticateAdmin(email: string, password: string) {
  // Find admin by email
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return null;
  }

  // Verify password
  const isValid = await verifyPassword(password, admin.passwordHash);
  if (!isValid) {
    return null;
  }

  // Create session
  const { token, expiresAt } = await createSession(admin.id, admin.email);

  return {
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
    token,
    expiresAt,
  };
}

