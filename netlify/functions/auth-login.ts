import { Handler } from '@netlify/functions';
import passport from './lib/passport-config';
import jwt from 'jsonwebtoken';

// JWT secret - in production, this should be a secure environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

interface LoginRequest {
  email: string;
  password: string;
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
    const body: LoginRequest = JSON.parse(event.body || '{}');
    const { email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Email and password are required' }),
      };
    }

    // Use Passport.js to authenticate
    return new Promise<any>((resolve) => {
      passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) {
          console.error('Passport authentication error:', err);
          resolve({
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Authentication failed. Please try again.' }),
          });
          return;
        }

        if (!user) {
          resolve({
            statusCode: 401,
            headers,
            body: JSON.stringify({ 
              message: info?.message || 'Invalid email or password' 
            }),
          });
          return;
        }

        try {
          // Generate JWT token
          const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          resolve({
            statusCode: 200,
            headers,
            body: JSON.stringify({
              token,
              user,
              message: 'Login successful',
            }),
          });
        } catch (tokenError) {
          console.error('Token generation error:', tokenError);
          resolve({
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Login failed. Please try again.' }),
          });
        }
      })({ body: { email, password } } as any);
    });
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Login failed. Please try again.' }),
    };
  }
};
