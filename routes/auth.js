const express = require('express');
const { register, login, participantLogin } = require('../controllers/Auth');
const router = express.Router();

// Rotta per la registrazione
router.post('/register', register);

// Rotta per il login
router.post('/login', login);

router.post('/participant-login', participantLogin)

module.exports = router;