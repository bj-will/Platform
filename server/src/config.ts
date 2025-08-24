import dotenv from 'dotenv'
import path from 'path'
import assert from 'assert'

// Pick env file based on process arg
var envFilename = process.argv[2] === 'dev' ? '.env.dev' : '.env.prod'
if (process.env.ENV_ALIAS === 'dev') {
  envFilename = '.env.dev'
}

dotenv.config({ path: path.resolve(`../${envFilename}`) })

console.log(process.env.NODE_ENV, path.resolve(`${envFilename}`))

const {
  NODE_ENV,
  SERVER_LOCAL_PORT,
  SITE_LOCAL_PORT,
  JWT_SECRET,
  JWT_TTL,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

assert(NODE_ENV, 'NODE_ENV is required');
assert(SERVER_LOCAL_PORT, 'SERVER_LOCAL_PORT is required');
assert(JWT_SECRET, 'JWT_SECRET is required');
assert(JWT_TTL, 'JWT_TTL is required');

export const config = {
  nodeEnv: NODE_ENV,
  jwtSecret: JWT_SECRET,
  jwtTtl: parseInt(JWT_TTL, 10),
  localPort: parseInt(SERVER_LOCAL_PORT!, 10),
  siteLocalPort: parseInt(SITE_LOCAL_PORT!, 10),
  dbConnection: {
    user: DB_USERNAME,
    host: DB_HOST || 'localhost',
    database: DB_NAME || 'defaultDB',
    password: DB_PASSWORD,
    port: parseInt(DB_PORT!, 10),
    ssl: { rejectUnauthorized: false }, // allow self-signed cert
  }
};


console.log(`Running in ${NODE_ENV} mode ${envFilename}`);
