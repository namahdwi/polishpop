import { z } from 'zod';

const envSchema = z.object({
  FIREBASE_API_KEY: z.string().min(1),
  FIREBASE_AUTH_DOMAIN: z.string().min(1),
  FIREBASE_PROJECT_ID: z.string().min(1),
  WHATSAPP_ACCESS_TOKEN: z.string().min(1),
  WHATSAPP_PHONE_ID: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  ENCRYPTION_KEY: z.string().length(64),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export function validateEnv() {
  try {
    const parsed = envSchema.parse({
      FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      WHATSAPP_ACCESS_TOKEN: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN,
      WHATSAPP_PHONE_ID: import.meta.env.VITE_WHATSAPP_PHONE_ID,
      OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
      ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY,
      NODE_ENV: import.meta.env.MODE,
    });
    return parsed;
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw error;
  }
} 