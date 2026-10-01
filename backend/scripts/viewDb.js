/**
 * CLI Database Viewer Utility
 * 
 * Run with: node scripts/viewDb.js
 * Prints all tables, schema structures, and sample rows from aitestgen.db
 */

const { dbAll } = require('../db/database');

async function viewDatabase() {
  console.log('\n======================================================');
  console.log('🗄️  AI-TESTGEN SQLITE DATABASE INSPECTION');
  console.log('📁 Location: backend/data/aitestgen.db');
  console.log('======================================================\n');

  try {
    // 1. List all tables
    const tables = await dbAll("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    console.log(`📋 Found ${tables.length} Database Tables:`);
    tables.forEach(t => console.log(`   • ${t.name}`));
    console.log('\n------------------------------------------------------\n');

    // 2. Display summary and rows for each table
    for (const t of tables) {
      const rows = await dbAll(`SELECT * FROM ${t.name}`);
      console.log(`🔷 Table: [${t.name}] (${rows.length} rows)`);

      if (rows.length > 0) {
        // Print column headers
        const columns = Object.keys(rows[0]);
        console.log(`   Columns: ${columns.join(', ')}`);

        // Print preview of first 3 rows
        rows.slice(0, 3).forEach((r, idx) => {
          const preview = {};
          for (const key of columns) {
            let val = r[key];
            if (typeof val === 'string' && val.length > 35) {
              val = val.slice(0, 32) + '...';
            }
            preview[key] = val;
          }
          console.log(`   Row ${idx + 1}:`, preview);
        });

        if (rows.length > 3) {
          console.log(`   ... and ${rows.length - 3} more row(s)`);
        }
      } else {
        console.log('   (Empty table)');
      }
      console.log('');
    }

    console.log('======================================================');
    console.log('✅ Database inspection complete.');
    console.log('======================================================\n');
  } catch (err) {
    console.error('Error viewing database:', err.message);
  } finally {
    process.exit(0);
  }
}

viewDatabase();
