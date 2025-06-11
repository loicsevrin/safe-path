import buildings from './buildings.js';
import building from './building.js';
import rooms from './rooms.js';
import room from './room.js';

export default (app) => {
  app.use('', buildings);
  app.use('', building);
  app.use('', rooms);
  app.use('', room);
};
