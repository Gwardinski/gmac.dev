import dotenv from 'dotenv';
import z from 'zod';

dotenv.config({ path: '.env.local' });

const envSchema = z.object({
  NOTE_TITLE: z.string(),
  NOTE_CONTENT: z.string(),
  CODE: z.string(),
});
type EnvSchema = z.infer<typeof envSchema>;

function initEnv(): EnvSchema {
  const env: { [key: string]: string | number | undefined } = {};
  for (const key in envSchema.shape) {
    env[key] = process.env[key];
  }
  const validation = envSchema.safeParse(env);

  if (!validation.success) {
    const missing = validation.error.issues.map((issue) => issue.path[0]);
    throw new Error(`❌ Missing environment variables: ${missing.join(', ')}`);
  }

  return env as EnvSchema;
}

export const { NOTE_TITLE, NOTE_CONTENT, CODE } = initEnv();
