import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);

interface DemoUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  organization: string;
  phone?: string;
}

const demoUsers: DemoUser[] = [
  {
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@iwilprotocol.com',
    password: 'demo123456',
    role: 'doctor',
    organization: 'IWIL Medical Center',
    phone: '+1 (555) 123-4567'
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@iwilprotocol.com',
    password: 'demo123456',
    role: 'nutritionist',
    organization: 'IWIL Wellness Clinic',
    phone: '+1 (555) 234-5678'
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@iwilprotocol.com',
    password: 'demo123456',
    role: 'nurse',
    organization: 'IWIL Health Services',
    phone: '+1 (555) 345-6789'
  },
  {
    firstName: 'Dr. James',
    lastName: 'Wilson',
    email: 'james.wilson@iwilprotocol.com',
    password: 'demo123456',
    role: 'therapist',
    organization: 'IWIL Therapy Center',
    phone: '+1 (555) 456-7890'
  },
  {
    firstName: 'Lisa',
    lastName: 'Thompson',
    email: 'lisa.thompson@iwilprotocol.com',
    password: 'demo123456',
    role: 'wellness-coach',
    organization: 'IWIL Wellness Institute',
    phone: '+1 (555) 567-8901'
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@iwilprotocol.com',
    password: 'admin123456',
    role: 'administrator',
    organization: 'IWIL Protocol HQ',
    phone: '+1 (555) 678-9012'
  }
];

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
    // Ensure staff table exists
    await ensureStaffTableExists();

    const createdUsers: any[] = [];
    const skippedUsers: any[] = [];

    for (const user of demoUsers) {
      try {
        // Check if user already exists
        const existingUsers = await sql`
          SELECT id FROM staff WHERE email = ${user.email.toLowerCase()}
        `;

        if (existingUsers.length > 0) {
          skippedUsers.push({
            email: user.email,
            reason: 'User already exists'
          });
          continue;
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(user.password, saltRounds);

        // Generate user ID
        const userId = `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create new user
        await sql`
          INSERT INTO staff (
            id, first_name, last_name, email, password_hash, 
            role, organization, phone, created_at, updated_at
          ) VALUES (
            ${userId}, ${user.firstName}, ${user.lastName}, ${user.email.toLowerCase()}, ${passwordHash},
            ${user.role}, ${user.organization}, ${user.phone || ''}, NOW(), NOW()
          )
        `;

        createdUsers.push({
          id: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email.toLowerCase(),
          role: user.role,
          organization: user.organization,
        });

      } catch (userError) {
        console.error(`Error creating user ${user.email}:`, userError);
        skippedUsers.push({
          email: user.email,
          reason: 'Creation failed'
        });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Demo data seeding completed',
        summary: {
          created: createdUsers.length,
          skipped: skippedUsers.length,
          total: demoUsers.length
        },
        createdUsers,
        skippedUsers,
        loginInstructions: {
          message: 'You can now login with any of the demo accounts',
          defaultPassword: 'demo123456',
          adminPassword: 'admin123456',
          availableRoles: ['doctor', 'nutritionist', 'nurse', 'therapist', 'wellness-coach', 'administrator']
        }
      }),
    };

  } catch (error) {
    console.error('Demo data seeding error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Failed to seed demo data',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

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
