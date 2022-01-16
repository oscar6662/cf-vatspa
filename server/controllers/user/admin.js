import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import { query } from '../db/db.js';
import { userExists, createUser } from './users.js';

dotenv.config();

export const router = express.Router();

router.use(cookieParser());

router.post('/api/admin/editUser', async (req, res) => {
  console.log(req.body);
  const { aspect, changeTo, id } = req.body;
  try {
    const q = `UPDATE users SET ${aspect} = $1 WHERE id = $2`;
    await query(q, [changeTo, id]);
    res.json({ response: 'done' });
  } catch (error) {
    res.json({ response: 'error' });
  }
});
