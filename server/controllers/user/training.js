// import fetch from 'node-fetch';
import { userData } from './users.js';

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
