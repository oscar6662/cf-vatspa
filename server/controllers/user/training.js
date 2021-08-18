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

router.post('/api/user/trainingrequest', async (req, res) => {
  const { token } = req.cookies;
  const data = await userData(token);
  const { dates, training } = req.body;
  try {
    const q = 'INSERT INTO "trainingRequests" (id, training, "availableDates") VALUES ($1, $2, $3)';
    await query(q, [data.data.cid, training.training, dates]);
    res.json({ response: 'training Request added succesfully' });
  } catch (error) {
    res.json({ response: 'error' });
  }
});

router.get('/api/trainingrequests', async (req, res) => {
  try {
    const q = 'SELECT * FROM "trainingRequests"';
    const r = await query(q);
    res.json(r.rows);
  } catch (error) {
    res.json({ response: 'error' });
  }
});
