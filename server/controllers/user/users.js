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
        Authorization: `Bearer ${r.rows[0].access}`,
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
    return r.rows;
  } catch (e) {
    return { error: e };
  }
}

export async function userIsAdmin(token) {
  const q = 'SELECT admin FROM users WHERE jwt = ?';
  try {
    const r = await query(q, [token]);
    return await r.rows[0].admin;
  } catch (e) {
    return { error: e };
  }
}

export async function userIsMentor(token) {
  const q = 'SELECT mentor FROM users WHERE jwt = ?';
  try {
    const r = await query(q, [token]);
    return await r.rows[0].mentor;
  } catch (e) {
    return { error: e };
  }
}

export async function userExists(id) {
  const q = 'SELECT COUNT(*) AS count FROM users WHERE id = ?';
  try {
    const r = await query(q, [parseInt(id, 10)]);
    console.log(r);
    if (r[0].count == '1') return true;
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
    // eslint-disable-next-line max-len
    + '(id, user_name, user_email, rating, local_controller, active_controller, mentor, admin, jwt, access, refresh, date) '
    + 'VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';

  const q2 = `CREATE TABLE IF NOT EXISTS user_${data.cid} (`
    + 'id integer unique not null,'
    + 'training_airport varchar(4) not null,'
    + 'mad integer not null default 0,'
    + 'pmi integer not null default 0,'
    + 'bcn integer not null default 0,'
    + 'basic boolean not null default false,'
    + 'glesson boolean not null default false,'
    + 'atsim1 boolean not null default false,'
    + 'intro boolean not null default false,'
    + 'gexam boolean not null default false,'
    + 's1 boolean not null default false,'
    + 'tlesson boolean not null default false,'
    + 'tintro boolean not null default false,'
    + 'texam boolean not null default false,'
    + 'atsim2 boolean not null default false,'
    + 's2 boolean not null default false,'
    + 'tmadprep boolean not null default false,'
    + 'tbcnprep boolean not null default false,'
    + 'tpmiprep boolean not null default false,'
    + 'alesson boolean not null default false,'
    + 'aintro boolean not null default false,'
    + 'aintroadv boolean not null default false,'
    + 'atsim3 boolean not null default false,'
    + 'aexam boolean not null default false,'
    + 's3 boolean not null default false,'
    + 'amadprep boolean not null default false,'
    + 'abcnprep boolean not null default false,'
    + 'apmiprep boolean not null default false,'
    + 'tmadadv boolean not null default false,'
    + 'tbcnadv boolean not null default false,'
    + 'tpmiadv boolean not null default false,'
    + 'rlesson boolean not null default false,'
    + 'rintro boolean not null default false,'
    + 'radv boolean not null default false,'
    + 'atsim4 boolean not null default false,'
    + 'c1 boolean not null default false);';

  const q3 = `INSERT INTO user_${data.cid}`
    // eslint-disable-next-line max-len
    + '(id, training_airport, s1, s2, s3, c1) VALUES(?,?,?,?,?,?)';

  const q4 = `CREATE TABLE IF NOT EXISTS trainings_${data.cid} (`
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
    await query(q2);
    await query(q3, [parseInt(data.cid, 10),
      'LEIB',
      data.vatsim.rating.id > 1,
      data.vatsim.rating.id > 2,
      data.vatsim.rating.id > 3,
      data.vatsim.rating.id > 4]);
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
