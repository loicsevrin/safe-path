import Router from 'express-promise-router';
import { query } from '../db/db_manager.js';

const router = new Router();

router.get('/building/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT id, name, ST_AsGeoJson(St_transform(geom,4326)) geom FROM buildings WHERE id = $1', [id]);
  if (rows.length === 0) {
    res.sendStatus(404);
    return;
  }
  res.send(rows[0]);
});

router.post('/building/', async (req, res) => {
  const { body } = req;
  if (body.name === undefined) {
    res.sendStatus(400);
  } else {
    await query('INSERT INTO buildings (name) VALUES ($1)', [body.name]);
    res.sendStatus(200);
  }
});

router.get('/building/:id/rooms', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT rooms.id, rooms.name, rooms.capacity, ST_AsGeoJson(St_transform(rooms.geom,4326)) geom FROM rooms INNER JOIN buildings ON rooms.building_id = buildings.id WHERE buildings.id = $1', [id]);
  if (rows.length === 0) {
    res.sendStatus(404);
    return;
  }
  res.send(rows);
});

router.get('/building/:id/capacity', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT SUM(rooms.capacity) as capacity FROM rooms INNER JOIN buildings ON rooms.building_id = buildings.id WHERE buildings.id = $1 GROUP BY rooms.building_id', [id]);
  if (rows.length === 0) {
    res.sendStatus(404);
    return;
  }
  res.send(rows[0]);
});

export { router as default };
