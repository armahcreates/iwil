import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Configure Local Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email: string, password: string, done) => {
    try {
      // Ensure staff table exists
      await ensureStaffTableExists();

      // Find user by email
      const users = await sql`
        SELECT * FROM staff WHERE email = ${email.toLowerCase()}
      `;

      if (users.length === 0) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      const user = users[0];

      // Check if user is active
      if (!user.is_active) {
        return done(null, false, { message: 'Account is deactivated' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid email or password' });
      }

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

      return done(null, userData);
    } catch (error) {
      console.error('Authentication error:', error);
      return done(error);
    }
  }
));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const users = await sql`
      SELECT * FROM staff WHERE id = ${id} AND is_active = true
    `;

    if (users.length === 0) {
      return done(null, false);
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

    done(null, userData);
  } catch (error) {
    console.error('Deserialization error:', error);
    done(error);
  }
});

// Helper function to ensure staff table exists
async function ensureStaffTableExists() {
  try {
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

// Helper function to register a new user
export async function registerUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  organization?: string;
  phone?: string;
}) {
  const { firstName, lastName, email, password, role, organization, phone } = userData;

  // Ensure staff table exists
  await ensureStaffTableExists();

  // Check if user already exists
  const existingUsers = await sql`
    SELECT id FROM staff WHERE email = ${email.toLowerCase()}
  `;

  if (existingUsers.length > 0) {
    throw new Error('An account with this email already exists');
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

  // Return user data
  return {
    id: userId,
    firstName,
    lastName,
    email: email.toLowerCase(),
    role: role || 'staff',
    organization: organization || '',
    phone: phone || '',
    createdAt: new Date(),
  };
}

export default passport;
