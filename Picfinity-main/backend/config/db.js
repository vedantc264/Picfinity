import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'picfinity'
} = process.env;

let pool = null;

export async function initDatabase() {
  try {
    // Connect without selecting DB to ensure DB exists
    const initialConnection = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD
    });

    await initialConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await initialConnection.end();

    // Now establish connection pool with DB_NAME
    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        profile_image VARCHAR(500) DEFAULT NULL,
        otp VARCHAR(10) DEFAULT NULL,
        otp_expiry DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Create photos table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        photo_url TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        likes INT DEFAULT 0,
        author_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_author (author_id),
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // Create saved_photos table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_photos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        photo_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_photo (user_id, photo_id),
        INDEX idx_user (user_id),
        INDEX idx_photo (photo_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log(`[DB] MySQL database "${DB_NAME}" and tables initialized successfully.`);
    return pool;
  } catch (error) {
    console.error('[DB] Error initializing database:', error);
    throw error;
  }
}

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

export default getPool;
