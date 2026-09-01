import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const dbPath = path.resolve(__dirname, 'dev.db');

const localClient = createClient({
  url: `file:${dbPath}`,
});

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoAuthToken) {
  console.error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env');
  process.exit(1);
}

const tursoClient = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

async function main() {
  console.log('Connecting to local SQLite and Turso...');

  // Get table definitions
  const tables = await localClient.execute(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations';"
  );

  console.log(`Found ${tables.rows.length} tables in local dev.db. Pushing schema to Turso...`);

  for (const row of tables.rows) {
    if (row.sql) {
      try {
        await tursoClient.execute(row.sql as string);
      } catch (err: any) {
        console.warn(`Warning executing DDL: ${err.message}`);
      }
    }
  }

  // Get indexes
  const indexes = await localClient.execute(
    "SELECT sql FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%' AND sql IS NOT NULL;"
  );

  for (const row of indexes.rows) {
    if (row.sql) {
      try {
        await tursoClient.execute(row.sql as string);
      } catch (err: any) {
        // Index might already exist
      }
    }
  }

  // Copy data
  const tableNames = await localClient.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations';"
  );

  for (const tRow of tableNames.rows) {
    const tableName = tRow.name as string;
    const data = await localClient.execute(`SELECT * FROM "${tableName}"`);
    if (data.rows.length === 0) continue;

    console.log(`Syncing ${data.rows.length} rows for table: ${tableName}...`);
    const columns = data.columns;
    const placeholders = columns.map(() => '?').join(', ');
    const insertSql = `INSERT OR REPLACE INTO "${tableName}" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES (${placeholders})`;

    for (const row of data.rows) {
      const args = columns.map((col) => row[col]);
      await tursoClient.execute({ sql: insertSql, args: args as any });
    }
  }

  console.log('✅ Successfully migrated all tables and data to Turso Cloud!');
}

main().catch((err) => {
  console.error('Error during Turso sync:', err);
  process.exit(1);
});
