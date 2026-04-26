// Creates a Postgres connection pool using the DATABASE_URL environment variable.
// This file only sets up the pool; do not change connection logic without testing.
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default pool;