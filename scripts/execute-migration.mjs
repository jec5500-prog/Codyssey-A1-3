import fs from 'fs';
import path from 'path';

async function runMigration() {
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260813000000_create_users_table.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('----------------------------------------------------');
  console.log('Supabase SQL Migration script successfully prepared:');
  console.log(migrationPath);
  console.log('----------------------------------------------------');
  console.log(sql);
}

runMigration().catch(console.error);
