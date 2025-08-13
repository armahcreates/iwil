import { Handler } from '@netlify/functions';
import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    // Get token from Authorization header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'No valid token provided' }),
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    if (!userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }

    // Get user data from database
    const users = await sql`
      SELECT * FROM staff WHERE id = ${userId} AND is_active = true
    `;

    if (users.length === 0) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'User not found or inactive' }),
      };
    }

    const user = users[0];
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

    // Handle different HTTP methods
    if (event.httpMethod === 'GET') {
      // Get current session/user info
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: userData,
          isAuthenticated: true,
        }),
      };
    } else if (event.httpMethod === 'POST') {
      // Handle logout or session refresh
      const body = JSON.parse(event.body || '{}');
      
      if (body.action === 'logout') {
        // In a stateless JWT system, logout is handled client-side
        // But we can add token blacklisting here if needed
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'Logged out successfully',
          }),
        };
      } else if (body.action === 'refresh') {
        // Generate new token with extended expiry
        const newToken = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            token: newToken,
            user: userData,
            message: 'Token refreshed successfully',
          }),
        };
      }
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  } catch (error) {
    console.error('Session error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Invalid or expired token' }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Session validation failed' }),
    };
  }
};
