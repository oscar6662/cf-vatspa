import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const {
  DATABASE_HOST: host,
  DATABASE_USER: user,
  DATABASE_PASSWORD: password,
  DATABASE: database,
} = process.env;

if (!host) {
  console.error('Vantar DATABASE_URL!');
  process.exit(1);
}

const pool = mariadb.createPool({
  host: host,
  user: user,
  password: password,
  database: 'vatspa_formacion',
  port: '3306',
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
    if (conn) return client.end();
  }
}
