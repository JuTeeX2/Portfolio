// Собирает только email для формы
// Можно изменить на регистрацию и авторизацию
const UserModel = require('../models/userModel')

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

exports.createUsersTable = async (req, res) => {
  try {
    await UserModel.createTable();
    res.status(200).json({ message: "Users table created successfully" });
  } catch (error) {
    console.error('Error creating users table:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        error: "Name, email and password are required",
        details: {
          email: !email ? "Email is required" : null,
        }
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: "Invalid email format",
        details: "Email must be in format: user@example.com"
      });
    }

    const user = await UserModel.create({ email });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ error: "User with this email already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    const user = await UserModel.update(id, { email });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.delete(id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};