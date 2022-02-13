import dotenv from 'dotenv';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { query } from '../db/db.js';

dotenv.config();

export async function userData(token) {
  const q = 'SELECT access FROM users WHERE jwt = ?';
  try {
    const r = await query(q, [token]);
    const data = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${r[0].access}`,
      },
    });
    return await data.json();
  } catch (e) {
    return { error: e };
  }
}

export async function specificUserData(id) {
  const q = 'SELECT * FROM users WHERE id = ?';
  try {
    const r = await query(q, [parseInt(id, 10)]);
    return r;
  } catch (e) {
    return { error: e };
  }
}

export async function userIsAdmin(token) {
  const q = 'SELECT admin FROM users WHERE jwt = ?';
  try {
    const r = await query(q, [token]);
    return await r[0].admin;
  } catch (e) {
    return { error: e };
  }
}

export async function userIsMentor(token) {
  const q = 'SELECT mentor FROM users WHERE jwt = ?';
  try {
    const r = await query(q, [token]);
    return await r[0].mentor;
  } catch (e) {
    return { error: e };
  }
}

export async function userExists(id) {
  const q = 'SELECT COUNT(*) AS count FROM users WHERE id = ?';
  try {
    const r = await query(q, [parseInt(id, 10)]);
    console.log((r[0].count === 1));
    if (r[0].count === 1) return true;
    return false;
  } catch (error) {
    return false;
  }
}

export async function allUsers() {
  const q = 'SELECT user_name, id, mentor, admin FROM users';
  try {
    const r = await query(q);
    return r;
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
    // eslint-disable-next-line max-len
    + '(id, user_name, user_email, rating, local_controller, active_controller, mentor, admin, jwt, access, refresh, date) '
    + 'VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
  const q1 = 'INSERT INTO training_users (id) VALUES (?)';

  const q4 = `CREATE TABLE IF NOT EXISTS training_history_${data.cid} (`
    + 'training varchar(64) not null,'
    + 'pass boolean not null,'
    + 'mentor varchar(64) not null,'
    + 'date date not null,'
    + 'comments varchar(1024));';

  try {
    await query(q, [parseInt(data.cid, 10), data.personal.name_full,
      data.personal.email, parseInt(data.vatsim.rating.id, 10),
      (data.vatsim.subdivision.code === 'SPN'), false, false, false,
      token, r.access_token, r.refresh_token, moment(expiry).format('YYYY-MM-DD HH:mm:ss.000')]);
    await query(q1, parseInt(data.cid, 10));
    await query(q4);
  } catch (error) {
    console.log(error);
    return error;
  }
  return token;
}

export async function makeToken(data, r) {
  const payload = { email: data.cid };
  const tokenOptions = { expiresIn: r.expires_in };
  const token = jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);
  const expiry = new Date(Date.now() + r.expires_in * 1000);
  // eslint-disable-next-line max-len
  const q = `UPDATE users SET jwt = ?, access = ?, refresh = ?, date = ? WHERE id = ${data.cid}`;
  try {
    await query(q, [token, r.access_token, r.refresh_token, expiry]);
  } catch (error) {
    console.log(error);
    return false;
  }
  return token;
}
