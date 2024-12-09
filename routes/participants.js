const express = require('express');
const { getAllParticipants, getParticipantsById, updateParticipant, deleteParticipant, generateCourseCertificate } = require('../controllers/ParticipantsController');
const router = express.Router();
const protect = require('../middleware/auth');
const protect_2 = require('../middleware/auth_2')

// Rotte del corso
router.get('/select', protect, getAllParticipants);
router.get('/:id', protect, getParticipantsById)
router.put('/:id/modifica', protect, updateParticipant)
router.delete('/:id/elimina', protect, deleteParticipant)
router.post('/generate-certificate', protect_2, generateCourseCertificate)

module.exports = router;