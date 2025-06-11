import Router from 'express-promise-router';
import { query } from '../db/db_manager.js';

const router = new Router();

router.get('/room/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT id, name, capacity, building_id, ST_AsGeoJson(St_transform(geom,4326)) geom FROM rooms WHERE id = $1', [id]);
  if (rows.length === 0) {
    res.sendStatus(404);
    return;
  }
  res.send(rows[0]);
});

export { router as default };
