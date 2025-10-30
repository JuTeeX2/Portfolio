const pool = require('../config/db');

const PostModel = {

  async createTable() {
    try {
      const result = await pool.query(`
        CREATE TABLE IF NOT EXISTS site_post (
          id SERIAL PRIMARY KEY,
          number INTEGER,
          picture TEXT, -- Может быть одной картинкой или JSON массивом
          title VARCHAR(255) NOT NULL,
          content TEXT,
          post_type VARCHAR(50) DEFAULT 'single', -- 'single' или 'gallery'
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
        );
      console.log('Posts table created successfully');
      return result;
    } catch (error) {
      console.error('Error creating posts table:', error);
      throw error;
    }
  },

  async getAll() {
    try {
      const result = await pool.query(`
        SELECT * FROM site_post 
        ORDER BY number ASC, created_at DESC`
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting all posts:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM site_post WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting post by ID:', error);
      throw error;
    }
  },

  // Создать пост с одной картинкой и текстом
  async createSinglePost(postData) {
    try {
      const { number, picture, title, content } = postData;
      const result = await pool.query(
        `INSERT INTO site_post (number, picture, title, content, post_type) 
         VALUES ($1, $2, $3, $4, 'single') 
         RETURNING *`, [number, picture, title, content]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating single post:', error);
      throw error;
    }
  },

  // Создать галерею (много картинок с заголовком, без текста)
  async createGalleryPost(postData) {
    try {
      const { number, pictures, title } = postData;
      
      // Преобразуем массив картинок в JSON строку
      const picturesJson = JSON.stringify(pictures);
      
      const result = await pool.query(
        `INSERT INTO site_post (number, picture, title, content, post_type) 
         VALUES ($1, $2, $3, NULL, 'gallery') 
         RETURNING *`, [number, picturesJson, title]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating gallery post:', error);
      throw error;
    }
  },

  async update(id, postData) {
    try {
      const { number, picture, title, content, post_type } = postData;
      
      let pictureValue = picture;
      // Если это галерея и pictures передан как массив, преобразуем в JSON
      if (post_type === 'gallery' && Array.isArray(picture)) {
        pictureValue = JSON.stringify(picture);
      }
      
      const result = await pool.query(
        `UPDATE site_post 
         SET number = $1, picture = $2, title = $3, content = $4, 
             post_type = $5, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $6 
         RETURNING *`, [number, pictureValue, title, content, post_type, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM site_post WHERE id = $1 RETURNING *', [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  async getByType(postType) {
    try {
      const result = await pool.query(
        'SELECT * FROM site_post WHERE post_type = $1 ORDER BY number ASC, created_at DESC', [postType]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting posts by type:', error);
      throw error;
    }
  }
};

module.exports = PostModel;