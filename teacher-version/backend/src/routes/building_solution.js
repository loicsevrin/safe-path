// to be added to building.js

router.post('/building/geom', async (req, res) => {
  const { body } = req;
  if (body.geom === undefined || body.id === undefined) {
    res.sendStatus(400);
  } else {
    await query('UPDATE buildings SET geom = St_AsText(ST_GeomFromGeoJson($1)) WHERE id = $2', [body.geom, body.id]);
    res.sendStatus(200);
  }
});
