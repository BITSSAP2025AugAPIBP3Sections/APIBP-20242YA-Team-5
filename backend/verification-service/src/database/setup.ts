import fs from 'fs';
import path from 'path';
import pool from '@config/database';
import logger from '@utils/logger';

/**
 * Run database migrations
 */
export const runMigrations = async () => {
  try {
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    logger.info(`Found ${migrationFiles.length} migration files`);

    for (const file of migrationFiles) {
      logger.info(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await pool.query(sql);
      logger.info(`✅ Migration ${file} completed`);
    }

    logger.info('✅ All migrations completed successfully');
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    throw error;
  }
};

/**
 * Create database if it doesn't exist (run separately)
 */
export const createDatabase = async () => {
  try {
    // This should be run with a superuser connection
    await pool.query(`
      CREATE DATABASE verification_db
      WITH ENCODING 'UTF8'
      LC_COLLATE = 'en_US.UTF-8'
      LC_CTYPE = 'en_US.UTF-8'
      TEMPLATE template0;
    `);
    logger.info('✅ Database created successfully');
  } catch (error: any) {
    if (error.code === '42P04') {
      logger.info('Database already exists');
    } else {
      logger.error('Failed to create database:', error);
      throw error;
    }
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Migrations completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration failed:', error);
      process.exit(1);
    });
}
