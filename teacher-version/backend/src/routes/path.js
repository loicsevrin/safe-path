import Router from 'express-promise-router';
import { query } from '../db/db_manager.js';

const router = new Router();

// router.post('/safe-paths', async (req, res) => {
//   const { body } = req;
//   if (body.type === undefined || body.geom === undefined || body.status === undefined) {
//     res.sendStatus(400);
//   } else {
//     await query('INSERT INTO devices (type, geom, status) VALUES ($1, $2, $3)', [body.type, body.geom, body.status]);
//     res.sendStatus(200);
//   }
// });

router.get('/safe-paths', async (req, res) => {
  console.log('Fetching safe paths');
  const { rows } = await query('SELECT ' +
    'id, start_lat, start_lng , end_lat ,  end_lng , light_intensity, cleanliness, crowdedness ' +
    'FROM map;');
  res.send(rows);
});

router.get('/', async (req, res) => {
  res.send(200);
});


export { router as default };
