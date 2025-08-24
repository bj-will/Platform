// scripts/sync-env-to-frontend.ts
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFilename = process.argv[2] === 'dev' ? '.env.dev' : '.env.prod';
dotenv.config({ path: path.resolve(__dirname, `../../${envFilename}`) });

const frontendEnv = {
  VITE_NODE_ENV: process.env.NODE_ENV || '',
  VITE_API_BASE: `http://localhost:${process.env.SERVER_LOCAL_PORT || ''}`
};

const frontendEnvPath = path.resolve(__dirname, '../.env');
const envString = Object.entries(frontendEnv)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync(frontendEnvPath, envString, 'utf8');
console.log(`Frontend .env written to ${frontendEnvPath}`);
