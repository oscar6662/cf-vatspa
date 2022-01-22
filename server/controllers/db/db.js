import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const {
  DATABASE_HOST: host,
  DATABASE_USER: user,
  DATABASE_PASSWORD: password,
} = process.env;

/*
if (!host) {
  console.error('Vantar DATABASE_URL!');
  process.exit(1);
}
*/

const pool = mariadb.createPool({
  host,
  user,
  password,
  database: 'vatspa_formacion',
  port: '3306',
});

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
  return undefined;
}
