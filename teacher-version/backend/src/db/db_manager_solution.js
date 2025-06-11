/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import pg from 'pg';

import 'dotenv/config'
var username = process.env.PG_USERNAME
var password = process.env.PG_PASSWORD
var host = process.env.PG_HOST

async function createDevicesTable() {
  const pool = new pg.Pool({
    connectionString: `postgres://${username}:${password}@${host}/${dbName}`,
  });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const devicesTableQuery = `CREATE TABLE IF NOT EXISTS devices (
      id SERIAL PRIMARY KEY,
      type VARCHAR NOT NULL,
      geom geometry('POINT',4326,2),
      status VARCHAR NOT NULL
      );`;
    await client.query(devicesTableQuery);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
  }
  client.release();
}

export {
  addPostgisToDb, createDevicesTable,
};
