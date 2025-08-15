const fs = require('fs');
const path = require('path');
const pool = require('./routes/db.js');

const MIGRATION_DIR = './db/migrations';

// Sort migrations numerically by version number
function sortMigrations(files) {
  return files.sort((a, b) => {
    const aMatch = a.match(/V(\d+)__/);
    const bMatch = b.match(/V(\d+)__/);
    
    if (!aMatch || !bMatch) return a.localeCompare(b);
    
    const aNum = parseInt(aMatch[1]);
    const bNum = parseInt(bMatch[1]);
    
    return aNum - bNum;
  });
}

async function runMigrations() {
  try {
    console.log('🗄️  Starting migrations...');
    
    // Get all migration files and sort them numerically
    const migrationFiles = sortMigrations(
      fs.readdirSync(MIGRATION_DIR)
        .filter(file => file.endsWith('.sql'))
    );
    
    console.log(`Found ${migrationFiles.length} migration files:`, migrationFiles);
    
    for (const file of migrationFiles) {
      const filePath = path.join(MIGRATION_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`Executing: ${file}`);
      await pool.query(sql);
      console.log(`✅ Completed: ${file}`);
    }
    
    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
