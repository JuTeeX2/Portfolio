// Собирает только email для формы
// Можно изменить на регистрацию и авторизацию
const pool = require('../config/db');

const UserModel = {

  async createTable() {
    const result = await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
    return result;
  },

  async findAll() {
    const result = await pool.query(`
      SELECT id, email, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC`
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT id, email, created_at, updated_at 
      FROM users 
      WHERE id = $1`, [id]
    );
    return result.rows[0];
  },

  async create(userData) {
    const { email } = userData;
    const result = await pool.query(
      `INSERT INTO users (email) 
       VALUES ($1) 
       RETURNING id, email, created_at`, [email]
    );
    return result.rows[0];
  },

  async update(id, userData) {
    const { email } = userData;
    const result = await pool.query(
      `UPDATE users 
       SET email = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, email, updated_at`, [email, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
};

module.exports = UserModel;