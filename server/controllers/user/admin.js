import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { query } from '../db/db.js';

dotenv.config();

export const router = express.Router();

router.use(cookieParser());

router.post('/api/admin/editUser', async (req, res) => {
  const { aspect, changeTo, id } = req.body;
  try {
    const q = `UPDATE users SET ${aspect} = ? WHERE id = ?`;
    await query(q, [changeTo, id]);
    res.json({ response: 'done' });
  } catch (error) {
    res.json({ response: 'error' });
  }
});
