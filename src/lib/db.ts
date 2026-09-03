import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getDbPool() {
  if (!pool) {
    const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;

    if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DATABASE) {
      throw new Error(
        "Missing MySQL environment variables. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE.",
      );
    }

    pool = mysql.createPool({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      port: Number(MYSQL_PORT || 3306),
      connectionLimit: 5,
    });
  }

  return pool;
}
