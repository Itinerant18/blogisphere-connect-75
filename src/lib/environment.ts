// Common issue: Unvalidated environment variables

// Fix:
interface EnvVars {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_API_URL: string;
}

// Validation function for environment variables
function validateEnv(key: keyof EnvVars): string {
  const value = process.env[key];
  if (!value) {
    // In production, throw an error; in development, show a warning
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing environment variable: ${key}`);
    } else {
      console.warn(`Missing environment variable: ${key}`);
      return '[MISSING]';
    }
  }
  return value;
}

// Export validated environment variables
export const env = {
  SUPABASE_URL: validateEnv('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: validateEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  API_URL: validateEnv('NEXT_PUBLIC_API_URL'),
}; 