import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

const host = process.env.RDS_HOSTNAME ?? process.env.MYSQL_HOST ?? '127.0.0.1';
const port = process.env.RDS_PORT ?? process.env.MYSQL_PORT ?? '3306';
const user = process.env.RDS_USERNAME ?? process.env.MYSQL_USER ?? 'root';
const password = process.env.RDS_PASSWORD ?? process.env.MYSQL_PASSWORD ?? '';
const database = process.env.RDS_DB_NAME ?? process.env.MYSQL_DATABASE ?? 'n_chat_app';
const isLocalHost = host === 'localhost' || host === '127.0.0.1';

const poolConfig: mysql.PoolOptions = {
  host,
  port: Number(port),
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(isLocalHost ? {} : { ssl: { rejectUnauthorized: false } }),
};

const pool = mysql.createPool(poolConfig);

export const db = drizzle(pool);

let isPoolClosing = false;

async function closeMysqlPool() {
  if (isPoolClosing) return;
  isPoolClosing = true;
  try {
    await pool.end();
    console.info('MySQL pool closed');
  } catch (error) {
    console.error('MySQL pool close failed', error);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await closeMysqlPool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeMysqlPool();
  process.exit(0);
});
