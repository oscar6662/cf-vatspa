// import fetch from 'node-fetch';
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import { query } from '../db/db.js';
import { userData } from './users.js';
import { requireAuthentication } from './auth.js';

export const router = express.Router();

router.use(cookieParser());

export async function isAllowedToRequestTraining(req) {
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
    return true;
  }
  return false;
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

router.post('/api/user/trainingrequest',
  requireAuthentication, isAllowedToRequestTraining, async (req) => {
    console.log("hollaaaa");
    console.log(req.body);
  });
