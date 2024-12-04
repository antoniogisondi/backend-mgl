const express = require('express');
const { getAllParticipants, getParticipantsById, updateParticipant, deleteParticipant } = require('../controllers/ParticipantsController');
const router = express.Router();
const protect = require('../middleware/auth');

// Rotte del corso
router.get('/select', protect, getAllParticipants);
router.get('/:id', protect, getParticipantsById)
router.put('/:id/modifica', protect, updateParticipant)
router.delete('/:id/elimina', protect, deleteParticipant)

module.exports = router;