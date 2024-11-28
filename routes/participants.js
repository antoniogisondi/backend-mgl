const express = require('express');
const {
    getAllParticipants
} = require('../controllers/ParticipantsController');
const router = express.Router();
const protect = require('../middleware/auth');

// Rotte del corso
router.get('/select', protect, getAllParticipants);

module.exports = router;