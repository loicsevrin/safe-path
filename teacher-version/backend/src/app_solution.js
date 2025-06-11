import express from 'express';
import chalk from 'chalk';
import {
  addPostgisToDb, createTables, populateRoomsAndBuildingsTablesIfEmpty, dropTables
} from './db/db_manager.js';
import {
  createDevicesTable
} from './db/db_manager_solution.js';
import { updateRoomsWithCoordinates, addDevices } from './src/populate_db_solution';
import routes from './routes/index.js';

const app = express();

app.use(express.static('../frontend'))

app.use(express.json());

async function init() {
  await addPostgisToDb();
  if(false) {
    await dropTables();
  } else {
    await createTables();
    await populateRoomsAndBuildingsTablesIfEmpty();
    await createDevicesTable();
    await updateRoomsWithCoordinates();
    await addDevices();
    routes(app);
  }
}

init();

app.listen(3000, () => {
  console.log(chalk.green('Online Spring School running on 3000!'));
});
