// import fetch from 'node-fetch';
import { userData } from './users.js';
import { query } from '../db/db.js';

export async function isAllowedToRequestTraining(token) {
  const data = await userData(token);
  console.log(data);
  if (data.data.vatsim.subdivision.code === 'SPA') {
    /**
     * await fetch(`https://api.vatsim.net/api/ratings/${data.cid}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    */
    return true;
  }
  return false;
}

export async function availableTrainings(token) {
  const data = await userData(token);
  const q = `SELECT * FROM user_${data.data.cid}`;
  const data2 = await query(q);
  const r = data2.rows[0];
  console.log(r.s2);
  for (const key in r) {
    if (r[key] === false) {
      return key;
    }
  }
  return false;
}
