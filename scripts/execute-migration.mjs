import fs from 'fs';
import path from 'path';

async function runMigration() {
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260813000000_create_users_table.sql');
  const seedPath = path.join(process.cwd(), 'supabase', 'seed.sql');

  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  console.log('====================================================');
  console.log('[PRODUCTION MIGRATION SQL] (Pure Schema & RLS Policies):');
  console.log(migrationPath);
  console.log('====================================================');
  console.log(migrationSql);

  console.log('\n====================================================');
  console.log('[LOCAL / TEST SEED DATA SQL] (Separated Test Data):');
  console.log(seedPath);
  console.log('====================================================');
  console.log(seedSql);
}

runMigration().catch(console.error);
