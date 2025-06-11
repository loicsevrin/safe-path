import Router from 'express-promise-router';
import { query } from '../db/db_manager.js';

const router = new Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT id, type, ST_AsGeoJson(St_transform(geom,4326)) geom, status FROM devices WHERE id = $1', [id]);
  if (rows.length === 0) {
    res.sendStatus(404);
    return;
  }
  res.send(rows[0]);
});

router.post('/', async (req, res) => {
  const { body } = req;
  if (body.type === undefined || body.geom === undefined || body.status === undefined ) {
    res.sendStatus(400);
  } else {
    await query('INSERT INTO devices (type, geom, status) VALUES ($1, $2, $3)', [body.type, body.geom, body.status]);
    res.sendStatus(200);
  }
});

router.post('/:id/:status', async (req, res) => {
  const { id, status } = req.params;
  await query('UPDATE devices SET status=$1 WHERE id=$2', [status, id]);
  res.sendStatus(200);
});


export { router as default };
