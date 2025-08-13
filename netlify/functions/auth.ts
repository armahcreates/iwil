import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL!);

// JWT secret - in production, this should be a secure environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

interface LoginRequest {
  action: 'login';
  email: string;
  password: string;
}

interface RegisterRequest {
  action: 'register';
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  organization?: string;
  phone?: string;
}

type AuthRequest = LoginRequest | RegisterRequest;

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const body: AuthRequest = JSON.parse(event.body || '{}');

    if (body.action === 'login') {
      return await handleLogin(body, headers);
    } else if (body.action === 'register') {
      return await handleRegister(body, headers);
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid action' }),
      };
    }
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

async function handleLogin(body: LoginRequest, headers: any) {
  const { email, password } = body;

  if (!email || !password) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Email and password are required' }),
    };
  }

  try {
    // Check if staff table exists, if not create it
    await ensureStaffTableExists();

    // Find user by email
    const users = await sql`
      SELECT * FROM staff WHERE email = ${email.toLowerCase()}
    `;

    if (users.length === 0) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Invalid email or password' }),
      };
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Invalid email or password' }),
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const userData = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      phone: user.phone,
      createdAt: user.created_at,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token,
        user: userData,
        message: 'Login successful',
      }),
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Login failed. Please try again.' }),
    };
  }
}

async function handleRegister(body: RegisterRequest, headers: any) {
  const { firstName, lastName, email, password, role, organization, phone } = body;

  if (!firstName || !lastName || !email || !password) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'First name, last name, email, and password are required' }),
    };
  }

  if (password.length < 8) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Password must be at least 8 characters long' }),
    };
  }

  try {
    // Check if staff table exists, if not create it
    await ensureStaffTableExists();

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM staff WHERE email = ${email.toLowerCase()}
    `;

    if (existingUsers.length > 0) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ message: 'An account with this email already exists' }),
      };
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create new user
    await sql`
      INSERT INTO staff (
        id, first_name, last_name, email, password_hash, 
        role, organization, phone, created_at, updated_at
      ) VALUES (
        ${userId}, ${firstName}, ${lastName}, ${email.toLowerCase()}, ${passwordHash},
        ${role || 'staff'}, ${organization || ''}, ${phone || ''}, NOW(), NOW()
      )
    `;

    // Generate JWT token
    const token = jwt.sign(
      { userId, email: email.toLowerCase() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data
    const userData = {
      id: userId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      role: role || 'staff',
      organization: organization || '',
      phone: phone || '',
      createdAt: new Date(),
    };

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        token,
        user: userData,
        message: 'Account created successfully',
      }),
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Registration failed. Please try again.' }),
    };
  }
}

async function ensureStaffTableExists() {
  try {
    // Create staff table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'staff',
        organization TEXT,
        phone TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Create index on email for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email)
    `;
  } catch (error) {
    console.error('Error ensuring staff table exists:', error);
    throw error;
  }
}
