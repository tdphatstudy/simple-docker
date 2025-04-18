const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

const adminClient = new Client({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: 'postgres',
});

async function createDatabaseIfNotExists() {
  try {
    await adminClient.connect();
    const res = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'`
    );

    if (res.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`✅ Created database: ${DB_NAME}`);
    } else {
      console.log(`✅ Database ${DB_NAME} already exists`);
    }
  } catch (err) {
    console.error('❌ Error checking/creating database:', err);
  } finally {
    await adminClient.end();
  }
}

async function runMigration() {
  const { Pool } = require('pg');
  const pool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  const filePath = path.join(__dirname, 'init.sql');
  const sql = fs.readFileSync(filePath, 'utf8');

  try {
    await pool.query(sql);
    console.log('✅ Migration complete!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await pool.end();
  }
}

async function main() {
  await createDatabaseIfNotExists();
  await runMigration();
}

main();
