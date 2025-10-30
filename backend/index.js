const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./src/config/db');

// Роутеры
const userRoutes = require('./src/routes/userRoutes');
const site_postRoutes = require('./src/routes/site_postRoutes');

// middleware
const { memoryLimiter } = require('./src/middleware/rateLimit');
const logger = require('./src/middleware/logger');

const app = express();

// Запускаем до всех
app.use(memoryLimiter);
app.use(logger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// 
app.use('/api', userRoutes);
app.use('/api', site_postRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Подключаемя к БД
pool.query('SELECT NOW()', (err, res) => {
  if(err) {
    console.error('Ошибка подключения к базе данных', err.stack);
  } else {
    console.log('Подключнено к базе данных:', res.rows);
  }
});

// Запускаем сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});