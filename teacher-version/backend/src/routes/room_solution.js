// to be appended to room.js

router.post('/room/geom', async (req, res) => {  
  const { body } = req;
  if (body.geom === undefined || body.id == undefined) {
    res.sendStatus(400);
  } else {
    await query('UPDATE rooms SET geom = St_AsText(ST_GeomFromGeoJson($1)) WHERE id = $2', [body.geom, body.id]);
    res.sendStatus(200);
  }
});

router.post('/room/:id/lamp/:status', async (req, res) => {  
  const { id, status } = req.params;
  await query("UPDATE devices SET status=$1 WHERE type = 'lamp' and id in " +
    "(SELECT devices.id FROM devices, rooms " +
	  "WHERE ST_Contains(rooms.geom, devices.geom) AND rooms.id = $2)", [status, id]);
  res.sendStatus(200);
});
