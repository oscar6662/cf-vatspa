import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import { query } from '../db/db.js';
import { userExists, updateUserToken, createUser} from './users.js';
dotenv.config();

export const router = express.Router();

router.use(cookieParser());

router.get('/api/auth', (req, res) => {
  try {
    res.redirect(`${process.env.REACT_APP_API_URL}/oauth/authorize?client_id=${process.env.client_id}
    &redirect_uri=${process.env.host}/api/auth/callback
    &response_type=code
    &scope=full_name+email+vatsim_details`);
  } catch (error) {
    res.status(401).json({ error })
  }
});

router.get('/api/auth/callback', async (req, res) => {
  const body = {
    grant_type: 'authorization_code',
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    redirect_uri: `${process.env.host}/api/auth/callback`,
    code: req.query.code,
  };
  let result = '';
  try {
    result = await fetch(`${process.env.REACT_APP_API_URL}/oauth/token`, {
      body: JSON.stringify(body),
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    });  
  } catch (error) {
    res.status(401).json({ error })
  }
  const r = await result.json();
  let data = '';
  try {
    data = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${r.access_token}`,
      },
    });
  } catch (error) {
    res.status(401).json({ error })
  }
  const d = await data.json();
  if (d.message == 'Unauthenticated.' || d.data.oauth.token_valid == 'undefined' ) {
    return res.sendStatus(403);
  }
  if (d.data.oauth.token_valid === 'true') {
    let token;
    if(await userExists(d.data.cid)){
      //TODO refresh token
      return res.redirect('/profile')
    } else{
      try {
        token = await createUser(d.data, r);
      } catch (error) {
        return res.sendStatus(403);
      }      
    }
    res.cookie('token', token, {
      expires: new Date(Date.now() + r.expires_in * 1000),
      httpOnly: true,
    });
    return res.redirect('/profile');
  }
  return res.sendStatus(403);
});

export async function requireAuthentication(req, res, next) {
  const { token } = req.cookies;
  if (token == null) return res.sendStatus(401);
  const verify = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return false;
    req.user = user;
    return true;
  });

  if (verify === false) return res.status(401).json({ error: 'token verification failed' });

  const q = 'SELECT date FROM token WHERE jwt = ($1)';
  try {
    const r = await query(q, [token]);
    if (r.rows.length < 0) return res.status(401).json({ error: 'No token found' });
    if (r.rows[0].date < new Date(Date.now())) {
      return res.status(401).json({ error: 'token expired' });
    }
    return next();
  } catch (e) {
    return res.status(401).json({ error: e });
  }
}

export async function isAuthenticated(req) {
  const { token } = req.cookies;
  console.log('token:');
  console.log(token);
  if (token == null) return false;
  const verify = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return false;
    req.user = user;
    return true;
  });

  if (verify === false) return false;

  const q = 'SELECT id FROM users WHERE jwt = ($1)';
  try {
    const r = await query(q, [token]);
    if (r.rows.length < 0) return false;
    if (r.rows[0].date < new Date(Date.now())) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

router.get('/api/logout', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  res.cookie('token', token, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.redirect('/');
});
