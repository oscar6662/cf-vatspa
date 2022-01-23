/* eslint-disable no-restricted-syntax */
// import fetch from 'node-fetch';
import express from 'express';
import moment from 'moment';
// import cookieParser from 'cookie-parser';
import { query } from '../db/db.js';
import { userData } from './users.js';
import { requireAuthentication } from './auth.js';

export const router = express.Router();
/*
router.use(cookieParser());
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
*/

async function hasRequestedTraining(data) {
  try {
    const q = 'SELECT * FROM trainingrequests WHERE id = ?';
    const r = await query(q, data.cid);
    console.log(r, r[0]);
    if (r[0] !== undefined) return true;
  } catch (error) {
    return true;
  }
  return false;
}

async function hasTraining(data) {
  try {
    const q = 'SELECT * FROM trainings WHERE id_student = ?';
    const r = await query(q, data.cid);
    if (r[0] !== undefined) return true;
  } catch (error) {
    return true;
  }
  return false;
}

export async function isAllowedToRequestTraining(token) {
  const { data } = await userData(token);
  if (await hasRequestedTraining(data) || await hasTraining(data)) return false;
  return true;
}

export async function availableTrainings(token) {
  let trainings = [];
  const { data } = await userData(token);
  if (hasRequestedTraining(data)) return 'requested';
  if (hasTraining(data)) return 'enrolled';
  let r;
  try {
    const q = `SELECT * FROM user_${data.data.cid}`;
    const [d] = await query(q);
    r = d;
    console.log(r);
  } catch (e) {
    return 'error';
  }
  if (data.data.vatsim.subdivision.id !== 'SPN') {
    trainings = ['Visitor'];
    return trainings;
  }

  if (data.data.vatsim.rating.id > 0 && r.basic === false) {
    trainings = ['Familiarization'];
    return trainings;
  }

  for (const key in r) {
    if (r[key] === false) {
      trainings = [...trainings, key];
      break;
    }
  }
  return trainings;
}

export async function completedTrainings(token) {
  const data = await userData(token);
  const q = `SELECT * FROM trainings_${data.data.cid}`;
  const data2 = await query(q);
  return data2[0];
}

router.post('/api/user/trainingrequest', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const data = await userData(token);
  const { dates, training } = req.body;
  try {
    const q = 'INSERT INTO trainingrequests (id, training) VALUES (?,?)';
    await query(q, [data.data.cid, training]);
    const q2 = 'SELECT `key` FROM trainingrequests WHERE id = ? AND training = ?';
    const r2 = await query(q2, [data.data.cid, training]);
    const q3 = 'INSERT INTO trainingrequests_dates (id, date) VALUES (?,?)';
    for (const date in dates) {
      if (dates[date] !== undefined) {
        // eslint-disable-next-line no-await-in-loop
        await query(q3, [r2[0].key, moment(dates[date]).format('YYYY-MM-DD')]);
      }
    }
    res.json({ response: 'training Request added succesfully' });
  } catch (error) {
    console.log(error);
    res.json({ response: 'error' });
  }
});

router.post('/api/trainingaccepted', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const data = await userData(token);
  const { date, training, mentor } = req.body;
  try {
    // eslint-disable-next-line max-len
    const q = 'INSERT INTO trainings (id_student, id_mentor, training, availabledate) VALUES (?,?,?,?)';
    // eslint-disable-next-line max-len
    await query(q, [data.data.cid, mentor, training, moment(date).format('YYYY-MM-DD HH:mm:ss.000')]);
    const q3 = 'SELECT `key` FROM trainingrequests WHERE id = ?';
    const r3 = await query(q3, data.data.cid);
    const q4 = 'DELETE FROM trainingrequests_dates WHERE id = ?';
    await query(q4, r3[0].key);
    const q1 = 'DELETE FROM trainingrequests WHERE id = ?';
    await query(q1, [data.data.cid]);
    // eslint-disable-next-line max-len
    const q2 = 'DELETE FROM trainingoffers WHERE (id = ? AND training = ? AND start = ?)';
    await query(q2, [mentor, training, date]);
    res.json({ response: 'training Request added succesfully' });
  } catch (error) {
    console.log(error);
    res.json({ response: 'error' });
  }
});

router.post('/api/user/traininoffer', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const data = await userData(token);
  const { dates, training } = req.body;
  try {
    const q = 'INSERT INTO trainingoffers (id, training, start, end) VALUES (?,?,?,?)';
    await query(q, [data.data.cid, training, dates[0], dates[1]]);
    res.json({ response: 'training Request added succesfully' });
  } catch (error) {
    console.log(error);
    res.json({ response: 'error' });
  }
});

router.get('/api/trainingrequests', requireAuthentication, async (req, res) => {
  try {
    const q = 'SELECT * FROM trainingrequests';
    const r = await query(q);
    res.json(r);
  } catch (error) {
    res.json({ response: 'error' });
  }
});

router.get('/api/user/training/requested', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const data = await userData(token);
  try {
    const q = 'SELECT * FROM trainingrequests WHERE id = ?';
    const r = await query(q, [data.data.cid]);
    res.json(r[0]);
  } catch (error) {
    res.json({ response: 'error' });
  }
});

router.get('/api/user/training/confirmed', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const data = await userData(token);
  try {
    const q = 'SELECT * FROM trainings WHERE id_student = ?';
    const r = await query(q, [data.data.cid]);
    res.json(r);
  } catch (error) {
    res.json({ response: 'error' });
  }
});

router.get('/api/availtrainingoffers', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const data = await userData(token);
  try {
    const q1 = 'SELECT * FROM trainings WHERE id_student = ?';
    const r1 = await query(q1, [data.data.cid]);
    if (r1[0] !== undefined) return res.json({ response: 'enrolled' });
    const q2 = 'SELECT * FROM trainingrequests WHERE id = ?';
    const r2 = await query(q2, [data.data.cid]);
    if (r2[0] !== undefined) {
      // eslint-disable-next-line max-len
      const q3 = 'SELECT * FROM trainingoffers WHERE (training = ? AND (for_user = ? OR for_user IS NULL))';
      const r3 = await query(q3, [r2[0].training, data.data.cid]);
      return res.json(r3);
    }
    return res.json({ response: 'null' });
  } catch (error) {
    console.log(error);
    return res.json({ response: 'error' });
  }
});
