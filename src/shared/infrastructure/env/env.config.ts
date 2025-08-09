import * as dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

export const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['local', 'development', 'production']).default('local'),
  PORT: z.coerce.number().default(3001),
  FRONTEND_URL: z.string().url(),
  API_BASE_URL: z.string().url(),

  // Database
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),

  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('24h'),
  FIREBASE_PROJECT_ID: z.string().optional().or(z.literal('')),
  FIREBASE_PRIVATE_KEY: z.string().optional().or(z.literal('')),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional().or(z.literal('')),

  // AWS
  AWS_ACCESS_KEY_ID: z.string().optional().or(z.literal('')),
  AWS_SECRET_ACCESS_KEY: z.string().optional().or(z.literal('')),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string().optional().or(z.literal('')),
  AWS_SES_FROM_EMAIL: z.string().email().optional().or(z.literal('')),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_URL: z.string().url().optional().or(z.literal('')),

  // Third-party APIs
  THIRDWEB_CLIENT_ID: z.string().optional().or(z.literal('')),
  THIRDWEB_CLIENT_SECRET: z.string().optional().or(z.literal('')),

  // OAuth2 Configuration
  OAUTH2_AUTHORIZATION_URL: z.string().url().optional().or(z.literal('')),
  OAUTH2_TOKEN_URL: z.string().url().optional().or(z.literal('')),
  OAUTH2_CLIENT_ID: z.string().optional().or(z.literal('')),
  OAUTH2_CLIENT_SECRET: z.string().optional().or(z.literal('')),
  OAUTH2_CALLBACK_URL: z.string().url().optional().or(z.literal('')),
  OAUTH2_SCOPE: z.string().optional().or(z.literal('')),
});

export type Env = z.infer<typeof envSchema>;

const safeParseEnv = (): Env => {
  const parsedEnv = envSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsedEnv.error.format()
    );
    process.exit(1);
  }

  return parsedEnv.data;
};

export const env = safeParseEnv();
