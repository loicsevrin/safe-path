import Router from 'express-promise-router';
import { query } from '../db/db_manager.js';

const router = new Router();

router.get('/', async (req, res) => {
  const { rows } = await query('SELECT id, type, ST_AsGeoJson(St_transform(geom,4326)) geom, status FROM devices');
  res.send(rows);
});

router.get('/inside-room/:roomId', async (req, res) => {
  const { roomId } = req.params;
  let resultRooms = await query(`
    SELECT geom FROM rooms WHERE id=$1 LIMIT 1`, [roomId]);
  const room = resultRooms.rows[0]
  //res.send(room)
  const { rows } = await query(`
    SELECT id, type, ST_AsGeoJson(St_transform(geom,4326)) geom, status 
    FROM devices WHERE ST_CONTAINS($1, geom)`, [room.geom]);
  res.send(rows);
});


export { router as default };
