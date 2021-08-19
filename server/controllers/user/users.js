import dotenv from 'dotenv';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { query } from '../db/db.js';

dotenv.config();

export async function userData(token) {
  const q = 'SELECT access FROM users WHERE jwt = $1 ';
  try {
    const r = await query(q, [token]);
    const data = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${r.rows[0].access}`,
      },
    });
    return await data.json();
  } catch (e) {
    return { error: e };
  }
}

export async function specificUserData(id) {
  const q = 'SELECT * FROM users WHERE id = $1 ';
  try {
    const r = await query(q, [id]);
    return r.rows;
  } catch (e) {
    return { error: e };
  }
}

export async function userIsAdmin(token) {
  const q = 'SELECT admin FROM users WHERE jwt = $1 ';
  try {
    const r = await query(q, [token]);
    return await r.rows[0].admin;
  } catch (e) {
    return { error: e };
  }
}

export async function userIsMentor(token) {
  const q = 'SELECT mentor FROM users WHERE jwt = $1 ';
  try {
    const r = await query(q, [token]);
    return await r.rows[0].mentor;
  } catch (e) {
    return { error: e };
  }
}

export async function userExists(id) {
  const q = 'SELECT COUNT(1) FROM users WHERE id = $1';
  try {
    const r = await query(q, [id]);
    if (r.rows[0].count === '1') return true;
    return false;
  } catch (error) {
    return false;
  }
}

export async function allUsers() {
  const q = 'SELECT user_name, id, mentor, admin FROM users';
  try {
    const r = await query(q);
    return r.rows;
  } catch (error) {
    return false;
  }
}

/**
export async function updateUserToken(){

}
*/

export async function createUser(data, r) {
  const payload = { email: data.cid };
  const tokenOptions = { expiresIn: r.expires_in };
  const token = jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);
  const expiry = new Date(Date.now() + r.expires_in * 1000);
  const q = 'INSERT INTO users'
    + '(id, user_name, user_email, mentor, admin, jwt, access, refresh, date)'
    + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';

  const q2 = `CREATE TABLE IF NOT EXISTS user_${data.cid} (`
    + 'id integer unique not null,'
    + 'S1 boolean not null,'
    + 'S2 boolean not null,'
    + 'S3 boolean not null,'
    + 'C1 boolean not null);';

  const q3 = `INSERT INTO user_${data.cid}`
    + '(id, S1, S2, S3, C1) VALUES($1, false, false, false, false)';

  const q4 = `CREATE TABLE IF NOT EXISTS trainings_${data.cid} (`
  + 'training varchar not null,'
  + 'pass boolean not null,'
  + 'mentor varchar not null,'
  + 'comments varchar);';

  try {
    await query(q,
      [data.cid, data.personal.name_full,
        data.personal.email, false, false,
        token, r.access_token, r.refresh_token, expiry,
      ]);
    await query(q2);
    await query(q3, [data.cid]);
    await query(q4);
  } catch (error) {
    console.log(error);
    return error;
  }
  console.log(token);
  return token;
}

export async function makeToken(data, r) {
  const payload = { email: data.cid };
  const tokenOptions = { expiresIn: r.expires_in };
  const token = jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);
  const q = `UPDATE users SET jwt = $1, access = $2, refresh = $3 WHERE id = ${data.cid}`;
  try {
    await query(q, [token, r.access_token, r.refresh_token]);
  } catch (error) {
    console.log(error);
    return false;
  }
  return token;
}
