import { Handler } from '@netlify/functions';
import { registerUser } from './lib/passport-config';
import jwt from 'jsonwebtoken';

// JWT secret - in production, this should be a secure environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  organization?: string;
  phone?: string;
}

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
    const body: RegisterRequest = JSON.parse(event.body || '{}');
    const { firstName, lastName, email, password, role, organization, phone } = body;

    if (!firstName || !lastName || !email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'First name, last name, email, and password are required' 
        }),
      };
    }

    if (password.length < 8) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'Password must be at least 8 characters long' 
        }),
      };
    }

    // Register the user using Passport.js helper
    const userData = await registerUser({
      firstName,
      lastName,
      email,
      password,
      role,
      organization,
      phone,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: userData.id, email: userData.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({ message: error.message }),
        };
      }
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Registration failed. Please try again.' }),
    };
  }
};
