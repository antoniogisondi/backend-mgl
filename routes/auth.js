const express = require('express');
const { register, login } = require('../controllers/Auth');
const router = express.Router();

// Rotta per la registrazione
router.post('/register', register);

// Rotta per il login
router.post('/login', login);

module.exports = router;