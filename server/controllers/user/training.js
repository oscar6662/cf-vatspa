import express from 'express';
import moment from 'moment';
import fetch from 'node-fetch';
import { query } from '../db/db.js';
import { userData } from './users.js';
import { requireAuthentication } from './auth.js';

export const router = express.Router();

/**
 * training_descriptions
 */

async function createTrainingDescription(data) {
  const {
    short,
    long,
    description,
    mentor,
    maxStudents,
  } = data;
  let {
    requires,
    unlocks,
  } = data;
  if (requires !== undefined) {
    requires = requires.toString();
  }
  if (unlocks !== undefined) {
    unlocks = unlocks.toString();
  }
  // eslint-disable-next-line max-len
  const q = 'INSERT INTO training_descriptions (`short`, `long`, description, requires, unlocks, mentor, max_students) VALUES (?,?,?,?,?,?,?)';
  const q2 = `ALTER TABLE training_users ADD ${short} TINYINT DEFAULT 0`;
  try {
    // eslint-disable-next-line max-len
    await query(q, [short, long, description, (requires === undefined) ? null : requires, (unlocks === undefined) ? null : unlocks, mentor, maxStudents]);
    await query(q2);
    return true;
  } catch (error) {
    return false;
  }
}

async function updateTrainingDescription(data) {
  const {
    originalshort,
    newshort,
    long,
    description,
    mentor,
    maxStudents,
  } = data;
  let {
    requires,
    unlocks,
  } = data;
  if (requires !== undefined && requires) {
    requires = requires.toString();
  }
  if (unlocks !== undefined || unlocks !== null) {
    unlocks = unlocks.toString();
  }
  // eslint-disable-next-line max-len
  const q = 'UPDATE training_descriptions SET `short` = ?, `long` = ?, description = ?, requires = ?, unlocks = ?, mentor = ?, max_students = ? WHERE `short` = ?';
  const q2 = `ALTER TABLE training_users RENAME COLUMN ${originalshort} TO ${newshort}`;
  try {
    await query(q, [
      newshort, long,
      description, (requires === undefined) ? null : requires,
      (unlocks === undefined) ? null : unlocks,
      mentor,
      maxStudents, originalshort,
    ]);
    if (originalshort !== newshort) {
      await query(q2);
    }
    return true;
  } catch (error) {
    return false;
  }
}

async function deleteTrainingDescription(short) {
  const q = 'DELETE FROM training_descriptions WHERE short = ?';
  const q2 = `ALTER TABLE training_users DROP COLUMN ${short}`;
  try {
    await query(q, short);
    await query(q2);
    return true;
  } catch (error) {
    return false;
  }
}

async function getTrainingDescriptions() {
  const q = 'SELECT * FROM training_descriptions';
  try {
    const r = await query(q);
    return r;
  } catch (e) {
    console.log(e);
    return null;
  }
}

router.get('/api/training/descriptions', requireAuthentication, async (req, res) => {
  const r = await getTrainingDescriptions();
  if (r === null) return res.status(500).json('Error parsing training descriptions');
  return res.json(r);
});

router.post('/api/training/descriptions', requireAuthentication, async (req, res) => {
  const data = req.body;
  const r = await createTrainingDescription(data);
  if (r) {
    return res.json('success');
  }
  // eslint-disable-next-line max-len
  return res.status(500).json('Unfortunatelly there was an error creating the new training description');
});

router.patch('/api/training/descriptions', requireAuthentication, async (req, res) => {
  const data = req.body;
  const r = await updateTrainingDescription(data);
  if (r) {
    return res.json('Success');
  }
  // eslint-disable-next-line max-len
  return res.status(500).json('Unfortunatelly there was an error updating the training description');
});

router.delete('/api/training/descriptions', requireAuthentication, async (req, res) => {
  const { short } = req.body;
  const r = await deleteTrainingDescription(short);
  if (r) {
    return res.json('Success');
  }
  // eslint-disable-next-line max-len
  return res.status(500).json('Unfortunatelly there was an error deleting the training description');
});

router.get('/api/training/user/:id', requireAuthentication, async (req, res) => {
  const { id } = req.params;
  const q = 'SELECT * FROM training_users WHERE id = ?';
  try {
    const r = await query(q, id);
    return res.json(r[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json('error');
  }
});

router.patch('/api/training/user', requireAuthentication, async (req, res) => {
  const {
    id,
    lesson,
    value,
  } = req.body;
  const q = `UPDATE training_users SET ${lesson} = ${value} WHERE id = ?`;

  try {
    const r = await query(q, id);
    if (r) return res.json('success');
  } catch (error) {
    return res.status(500).json('error');
  }
  return res.status(500).json('error');
});
/**
 * Is he allowed to ask for training?
 */

async function hasRequestedTraining(id) {
  try {
    const q = 'SELECT * FROM training_requests WHERE id = ?';
    const r = await query(q, id);
    if (r[0] !== undefined) return true;
  } catch (e) {
    return true;
  }
  return false;
}

async function hasTraining(id) {
  try {
    // eslint-disable-next-line max-len
    const q = 'SELECT * FROM training_scheduled WHERE EXISTS (SELECT * FROM training_scheduled_users WHERE user_id = ?)';
    const r = await query(q, id);
    if (r[0] !== undefined) return true;
  } catch (e) {
    return true;
  }
  return false;
}

async function isAllowedToRequestTraining(token) {
  const { data } = await userData(token);
  if (await hasRequestedTraining(data.cid) || await hasTraining(data.cid)) return false;
  return true;
}

router.get('/api/training/isallowedtorequest',
  async (req, res) => res.json(
    { response: await isAllowedToRequestTraining(req.cookies.token) },
  ));

/**
 * If so... What training(s)?
 */

// TODO: put this function in users.js
async function isUserActive(cid) {
  let connectionsLE = await fetch(`https://api.vatsim.net/api/ratings/${cid}/atcsessions/LE/?start=${moment().subtract(90, 'd').format('YYYY-MM-DD')}`);
  let connectionsGC = await fetch(`https://api.vatsim.net/api/ratings/${cid}/atcsessions/GC/?start=${moment().subtract(90, 'd').format('YYYY-MM-DD')}`);
  if (connectionsLE.detail === 'Not found.') connectionsLE = 0;
  if (connectionsGC.detail === 'Not found.') connectionsGC = 0;
  const count = connectionsLE.count + connectionsGC.count;
  if (count === 0) return false;
  let hours;
  // eslint-disable-next-line no-restricted-syntax
  for (const { connection } in connectionsLE.results) {
    if (Object.prototype.hasOwnProperty.call(connectionsLE.results, connection)) {
      if (hours > 5) return true;
      hours += connection.total_minutes_on_callsign / 60;
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const { connection } in connectionsGC.results) {
    if (Object.prototype.hasOwnProperty.call(connectionsGC.results, connection)) {
      if (hours > 5) return true;
      hours += connection.total_minutes_on_callsign / 60;
    }
  }
  return false;
}

export async function availableTrainings(token) {
  const { data } = await userData(token);
  if (await hasRequestedTraining(data.cid)) return 'requested';
  if (await hasTraining(data.cid)) return 'enrolled';
  let r;
  try {
    const q = 'SELECT * FROM training_users WHERE id = ?';
    const [d] = await query(q, data.cid);
    r = d;
  } catch (e) {
    return undefined;
  }
  // Find special cases e.g. 'Visitor, Familiarization, FastTrack'
  if (data.vatsim.rating.id === 0) return 'Suspended';
  if (data.vatsim.rating.id > 4) {
    if (data.vatsim.subdivision.id !== 'SPN') {
      if (r.basic !== false) {
        if (await isUserActive(data.cid)) {
          if (r.mad === true) return 'Nothing';
          return 'Madrid';
        } return 'Reactivation';
      } return 'Familiarization';
    } return ['Visitor', 'Transfer'];
  }
  if (data.vatsim.subdivision.id === 'SPN') {
    if (await isUserActive(data.cid)) return r.pointer.split(',');
    return 'Reactivation';
  }
  if (data.vatsim.rating.id > 2) return ['Visitor', 'Transfer'];
  return ['Transfer', 'IVAO'];
}

export async function completedTrainings(token) {
  const { data } = await userData(token);
  const q = `SELECT * FROM training_history_${data.cid}`;
  try {
    const r = await query(q);
    return r[0];
  } catch (e) {
    console.log(e);
    return null;
  }
}

router.get('/api/training/availabletrainings', requireAuthentication, async (req, res) => {
  const r = await availableTrainings(req.cookies.token);
  if (r !== undefined) return res.json({ trainings: await completedTrainings(req.cookies.token) });
  return res.status(500).json({ trainings: 'none' });
});

router.get('/api/training/completedtrainings', requireAuthentication, async (req, res) => {
  const r = await completedTrainings(req.cookies.token);
  if (r !== null) return res.json({ trainings: await completedTrainings(req.cookies.token) });
  return res.status(500).json({ trainings: 'none' });
});

/*
* Training Requests
*/
// TODO pass dates as well
router.get('/api/training/trainingrequest/:id', requireAuthentication, async (req, res) => {
  const { id } = req.params;
  if (id !== undefined || parseInt(id, 10) !== undefined || !Number.isNaN(parseInt(id, 10))) {
    try {
      const q = 'SELECT * FROM training_requests WHERE id = ?';
      const r = await query(q, [id]);
      return res.json(r[0]);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ response: 'error' });
    }
  } else {
    const q = 'SELECT * FROM training_requests';
    // const q2 = 'SELECT * FROM training_requests_dates WHERE `key` = ?';
    try {
      const r = await query(q);
      // const r2 = await query(q2, r[0].key);
      return res.json(r);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
});

router.post('/api/training/trainingrequest', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const { data } = await userData(token);
  const { dates, training } = req.body;
  if (!isAllowedToRequestTraining(token)) return res.status(404).json({ response: 'Not allowed' });
  try {
    const q = 'INSERT INTO training_requests (id, training) VALUES (?,?)';
    await query(q, [data.cid, training]);
    const q2 = 'SELECT `key` FROM training_requests WHERE id = ? AND training = ?';
    const r2 = await query(q2, [data.cid, training]);
    const q3 = 'INSERT INTO training_requests_dates (id, date) VALUES (?,?)';
    // eslint-disable-next-line no-restricted-syntax
    for (const date in dates) {
      if (dates[date] !== undefined) {
        // eslint-disable-next-line no-await-in-loop
        await query(q3, [r2[0].key, moment(dates[date]).format('YYYY-MM-DD')]);
      }
    }
    return res.json({ response: 'training Request added succesfully' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ response: 'error' });
  }
});

router.patch('/api/training/trainingrequest', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const { data } = await userData(token);
  const { dates, oldTraining, newTraining } = req.body;
  try {
    if (oldTraining !== newTraining) {
      const q = 'UPDATE training_requests SET training = ? WHERE id = ? AND training = ?';
      await query(q, [newTraining, data.cid, oldTraining]);
    }
    const q2 = 'SELECT `key` FROM training_requests WHERE id = ? AND training = ?';
    const r2 = await query(q2, [data.cid, newTraining]);
    const q3 = 'INSERT INTO training_requests_dates (id, date) VALUES (?,?)';
    const d = 'DELETE FROM training_requests_dates WHERE `key` = ?';
    await query(d, r2[0].key);
    // eslint-disable-next-line no-restricted-syntax
    for (const { date } in dates) {
      if (date !== undefined) {
        // eslint-disable-next-line no-await-in-loop
        await query(q3, [r2[0].key, moment(date).format('YYYY-MM-DD')]);
      }
    }
    return res.json({ response: 'training Request Updated succesfully' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ response: 'error' });
  }
});

router.delete('/api/training/trainingrequest', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const { data } = await userData(token);
  const { training } = req.body;
  try {
    const q2 = 'SELECT `key` FROM training_requests WHERE id = ? AND training = ?';
    const r2 = await query(q2, [data.cid, training]);
    const d = 'DELETE FROM training_requests_dates WHERE `key` = ?';
    await query(d, r2[0].key);
    const q = 'DELETE FROM training_requests WHERE `key` = ?';
    await query(q, r2[0].key);
    return res.json({ response: 'training Request deleted succesfully' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ response: 'error' });
  }
});

/*
 * Training Offers
 */
router.get('/api/training/offers/:id?', requireAuthentication, async (req, res) => {
  const { id } = req.params;
  if (id !== undefined) {
    try {
      const q = 'SELECT * FROM training_requests WHERE id = ?';
      const r = await query(q, id);
      if (r[0] !== undefined) {
        // eslint-disable-next-line max-len
        const q2 = 'SELECT * FROM training_offers WHERE (training = ? AND (for_user = ? OR for_user IS NULL))';
        const r2 = await query(q2, [r[0].training, id]);
        return res.json(r2);
      }
      return res.json({ response: 'null' });
    } catch (e) {
      console.log(e);
      return res.json({ response: 'error' });
    }
  } else {
    const q = 'SELECT * FROM training_offers';
    try {
      const r = await query(q);
      return res.json(r);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ response: 'error' });
    }
  }
});

router.post('/api/training/offer', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const { data } = await userData(token);
  const { dates, training } = req.body;
  try {
    const q = 'INSERT INTO training_offers (id, training, start, end) VALUES (?,?,?,?)';
    await query(q, [data.cid, training, dates[0], dates[1]]);
    res.json({ response: 'training Offer added succesfully' });
  } catch (e) {
    console.log(e);
    res.json({ response: 'error' });
  }
});

router.patch('/api/training/offer', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const { data } = await userData(token);
  const { oldDates, newDates, training } = req.body;
  try {
    // eslint-disable-next-line max-len
    const q = 'UPDATE training_offers SET training = ?, start = ?, end = ? WHERE id = ?, start = ?, end =?';
    await query(q, [training, newDates[0], newDates[1], data.cid, oldDates[0], oldDates[1]]);
    return res.json({ response: 'training Offer Updated succesfully' });
  } catch (e) {
    console.log(e);
    return res.json({ response: 'error' });
  }
});

router.delete('/api/training/offer', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const { data } = await userData(token);
  const { dates, training } = req.body;
  try {
    const q = 'DELETE FROM training_offers WHERE id = ? AND training = ? AND start = ? AND end = ?';
    await query(q, [data.cid, training, dates[0], dates[1]]);
    res.json({ response: 'Offer deleted succesfully' });
  } catch (e) {
    console.log(e);
    res.json({ response: 'error' });
  }
});

/*
 * Scheduled Trainings
 */

router.get('/api/training/schedule', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  const { data } = await userData(token);
  try {
    const q = 'SELECT * FROM trainings WHERE id_student = ? OR id_mentor = ?';
    const r = await query(q, [data.cid, data.cid]);
    return res.json(r);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ response: 'error' });
  }
});

router.post('/api/training/schedule', requireAuthentication, async (req, res) => {
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

router.delete('/api/training/schedule', requireAuthentication, async (req, res) => {
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
