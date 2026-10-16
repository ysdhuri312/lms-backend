import { beforeEach } from 'vitest';
import { db } from '../src/configs/db';
import { sql } from 'drizzle-orm';

const cleanDatabase = async () => {
  // find tables in database.
  const result = await db.execute(sql`SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename <> '__drizzle_migrations'`);

  const tables = result.rows.map((row) => row.tablename as string);

  if (tables.length === 0) {
    return;
  }

  // Getting all table names.
  const tableList = tables
    .map((table) => `"public"."${table.replace(/"/g, '""')}"`)
    .join(', ');

  // truncate all table data.
  await db.execute(
    sql.raw(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`),
  );
};

beforeEach(async () => {
  await cleanDatabase();
});

// afterAll(async () => {
//   try {
//     await cleanDatabase();
//   } finally {
//     await pool.end();
//   }
// });
