import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const {
  DATABASE_HOST: host = '127.28.0.1',
  DATABASE_USER: user = 'vatspa_formacion',
  DATABASE_PASSWORD: password,
  // NODE_ENV: nodeEnv = 'development',
} = process.env;
console.log(host);

if (!host) {
  console.error('Vantar DATABASE_URL!');
  process.exit(1);
}

const pool = mariadb.createPool({
  host,
  user,
  password,
  connectionLimit: 5,
});

// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development mode, þ.e.a.s. á local vél
// const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

// const pool = new pg.Pool({ connectionString, ssl });
/*
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
*/

export async function query(text, params) {
  let client;
  try {
    client = await pool.getConnection();
    const result = await client.query(text, params);
    return result;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
  return 'error';
}
