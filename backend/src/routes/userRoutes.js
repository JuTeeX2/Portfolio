// Собирает только email для формы
// Можно изменить на регистрацию и авторизацию
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users/init', userController.createUsersTable);

router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
// router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;