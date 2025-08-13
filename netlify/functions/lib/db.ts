import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables from .env file for local development
config();

let cachedSql: ReturnType<typeof neon> | null = null;

export function getSql() {
  if (cachedSql) return cachedSql;
  const databaseUrl = process.env.DATABASE_URL;
  
  // For local development without DATABASE_URL, return a mock that throws
  // This allows the functions to catch the error and use fallback data
  if (!databaseUrl || databaseUrl === 'YOUR_NEON_DATABASE_CONNECTION_STRING') {
    throw new Error('DATABASE_URL environment variable is not set or is a placeholder');
  }
  
  // Lazily initialize; if URL is invalid this will throw and can be caught by callers
  cachedSql = neon(databaseUrl);
  return cachedSql;
}
