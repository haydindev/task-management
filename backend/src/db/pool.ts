
import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PGHOST ?? "/tmp",
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE ?? "task_management",
  user: process.env.PGUSER ?? process.env.USER,
  password: process.env.PGPASSWORD,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (error) => {
  console.error("PostgreSQL bağlantı hatası:", error);
});
