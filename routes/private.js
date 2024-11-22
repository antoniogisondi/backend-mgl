const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth'); // Importa il middleware protect

// Rotta protetta
router.get('/private', protect, (req, res) => {
    res.json({ message: `Benvenuto, ${req.user.id}` }); // Assumi che req.user.name esista
});

module.exports = router;
