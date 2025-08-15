import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';

// Mock user storage for local development
interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: string;
  organization?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

const mockUsers: MockUser[] = [
  {
    id: 'staff_demo_1',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@iwil.com',
    passwordHash: '$2a$10$ziURsr4s9KFnx7X4hEpPiug/1D01Bp94.OgUsnA/vR.Xfb7jeXdw2', // password: 'demo123'
    role: 'staff',
    organization: 'IWIL Protocol',
    phone: '+1-555-0123',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'staff_admin_1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@iwil.com',
    passwordHash: '$2a$10$gM2UHT4RkE02FF./SFiXAeQDSvGeeHGnpTF9fDSYMs7cB04SnZ8Ru', // password: 'admin123'
    role: 'admin',
    organization: 'IWIL Protocol',
    phone: '+1-555-0124',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Configure Local Strategy with mock data
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email: string, password: string, done) => {
    try {
      // Find user by email in mock data
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Check if user is active
      if (!user.isActive) {
        return done(null, false, { message: 'Account is deactivated' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Return user data (without password)
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organization: user.organization,
        phone: user.phone,
        createdAt: user.createdAt,
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

// Deserialize user from session with mock data
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = mockUsers.find(u => u.id === id && u.isActive);

    if (!user) {
      return done(null, false);
    }

    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      organization: user.organization,
      phone: user.phone,
      createdAt: user.createdAt,
    };

    done(null, userData);
  } catch (error) {
    console.error('Deserialization error:', error);
    done(error);
  }
});

// Helper function to find user by email in mock data
function findUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Helper function to generate unique user ID
function generateUserId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `staff_${timestamp}_${random}`;
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
  try {
    const { firstName, lastName, email, password, role = 'staff', organization, phone } = userData;

    // Check if user already exists in mock data
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate unique user ID
    const userId = generateUserId();

    // Create new user object
    const newUser: MockUser = {
      id: userId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      role,
      organization: organization || '',
      phone: phone || '',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    // Add to mock users array
    mockUsers.push(newUser);

    // Return user data (without password)
    return {
      id: userId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      role,
      organization: organization || '',
      phone: phone || '',
      createdAt: newUser.createdAt,
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Export mock users for debugging (development only)
export { mockUsers };

export default passport;
