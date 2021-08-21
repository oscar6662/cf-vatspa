// import fetch from 'node-fetch';
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { query } from '../db/db.js';
import { userData } from './users.js';
import { requireAuthentication } from './auth.js';

export const router = express.Router();

router.use(cookieParser());
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',"http://localhost:3000");
  res.setHeader('Access-Control-Allow-Headers',"*");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

export async function isAllowedToRequestTraining(req, res) {
  const { token } = req.cookies;
  const data = await userData(token);
  if (data.data.vatsim.subdivision.code === 'SPA') {
    /**
     * await fetch(`https://api.vatsim.net/api/ratings/${data.cid}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    */
    return res.json(true);
  }
  return res.json(false);
}

export async function availableTrainings(token) {
  let trainings = [];
  const data = await userData(token);
  const q1 = 'SELECT * FROM trainingrequests WHERE id = $1';
  const data3 = await query(q1, [data.data.cid]);
  if (data3.rows[0] !== undefined) return 'enrolled';
  const q2 = 'SELECT * FROM trainings WHERE id_student = $1';
  const data4 = await query(q2, [data.data.cid]);
  if (data4.rows[0] !== undefined) return 'enrolled';
  const q = `SELECT * FROM user_${data.data.cid}`;
  const data2 = await query(q);
  const r = data2.rows[0];
  console.log(r.s2);
  for (const key in r) {
    if (r[key] === false) {
      trainings = [ ...trainings, key ];
      break;
    }
  }
  return trainings;
}

export async function completedTrainings(token) {
  const data = await userData(token);
  const q = `SELECT * FROM trainings_${data.data.cid}`;
  const data2 = await query(q);
  return data2.rows[0];
}

router.post('/api/user/trainingrequest', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const data = await userData(token);
  const { dates, training } = req.body;
  console.log(dates);
  try {
    const q = 'INSERT INTO "trainingrequests" (id, training, availabledates) VALUES ($1, $2, $3)';
    await query(q, [data.data.cid, training.training, dates]);
    res.json({ response: 'training Request added succesfully' });
  } catch (error) {
    console.log(error);
    res.json({ response: 'error' });
  }
});

router.post('/api/trainingaccepted', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const data = await userData(token);
  const { dates, training, mentor } = req.body;
  console.log(training);
  try {
    // eslint-disable-next-line max-len
    const q = 'INSERT INTO trainings (id_student, id_mentor, training, availabledate) VALUES ($1, $2, $3, $4)';
    await query(q, [data.data.cid, mentor, training, dates]);
    const q1 = 'DELETE FROM trainingrequests WHERE id = $1';
    await query(q1, [data.data.cid]);
    // eslint-disable-next-line max-len
    const q2 = 'DELETE FROM trainingoffers WHERE (id = $1 AND training = $2 AND availabledate = $3)';
    await query(q2, [mentor, training, dates]);
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
  console.log(dates);
  try {
    const q = 'INSERT INTO "trainingoffers" (id, training, "availabledate") VALUES ($1, $2, $3)';
    await query(q, [data.data.cid, training, dates]);
    res.json({ response: 'training Request added succesfully' });
  } catch (error) {
    console.log(error);
    res.json({ response: 'error' });
  }
});

router.get('/api/trainingrequests', requireAuthentication, async (req, res) => {
  try {
    const q = 'SELECT * FROM "trainingrequests"';
    const r = await query(q);
    res.json(r.rows);
  } catch (error) {
    res.json({ response: 'error' });
  }
});

router.get('/api/availtrainingoffers', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const data = await userData(token);
  try {
    const q1 = 'SELECT * FROM trainingrequests WHERE id = $1';
    const r1 = await query(q1, [data.data.cid]);
    if (r1.rows[0] !== undefined) {
      // eslint-disable-next-line max-len
      const q2 = 'SELECT * FROM trainingoffers WHERE (training = $1 AND ("for_user" = $2 OR "for_user" IS NULL))';
      const r2 = await query(q2, [r1.rows[0].training, data.data.cid]);
      console.log(r2.rows);
      return res.json(r2.rows);
    }
    return res.json(null);
  } catch (error) {
    console.log(error);
    return res.json({ response: 'error' });
  }
});
