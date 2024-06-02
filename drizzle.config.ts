import * as dotenv from 'dotenv';
import { type Config, defineConfig } from 'drizzle-kit';

dotenv.config();

export default defineConfig({
  schema: './src/schema.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL as string,
  },
} satisfies Config);
