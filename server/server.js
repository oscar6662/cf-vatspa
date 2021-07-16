import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import path, {dirname} from 'path';
import cors from 'cors';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import {
  router as authRouter,
  isAuthenticated,
  requireAuthentication,
} from './controllers/user/auth.js';
import {
  userData,
  userIsAdmin,
  userIsMentor,
} from './controllers/user/users.js';
import {
  isAllowedToRequestTraining
} from './controllers/user/training.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.static(path.join(__dirname, '/../client/build')));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(authRouter);

app.get('/api/authenticated', async (req, res) => {
  if (await isAuthenticated(req)) {
    return res.json({ loggedIn: true });
  }
  return res.json({ loggedIn: false });
});

app.get('/api/user', requireAuthentication, async (req, res) => {
  const data = await userData(req.cookies.token);
  return res.json(data.data);
});

app.get('/api/user/name', requireAuthentication, async (req, res) => {
  const data = await userData(req.cookies.token);
  return res.json(data.data.personal.name_full);
});

app.get('/api/user/admin', requireAuthentication, async (req, res) => {
  return res.json(await userIsAdmin(req.cookies.token));
});

app.get('/api/user/mentor', requireAuthentication, async (req, res) => {
  return res.json(await userIsMentor(req.cookies.token));
});

app.get('/api/user/reqtraining', async (req, res) => {
  const d = await fetch(`https://api.vatsim.net/api/ratings/1344329`, {
        headers: {
          Accept: 'application/json',
        },
      });
      return res.json(d);
  //return res.json(await isAllowedToRequestTraining(req.cookies.token));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

function notFoundHandler(req, res) {
  res.status(500).json({ error: 'Something went wrong' });
}

function errorHandler(err, req, res) {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
