import z from "zod";

const envSchema = z.object({
  NOTE_TITLE: z.string(),
  NOTE_CONTENT: z.string(),
  CODE: z.string(),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((val) => val.split(",")),
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
    throw new Error(`❌ Missing environment variables: ${missing.join(", ")}`);
  }

  return validation.data;
}

export const { NOTE_TITLE, NOTE_CONTENT, CODE, CORS_ORIGINS } = initEnv();
