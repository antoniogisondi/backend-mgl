const express = require('express')
const {CreateCheckoutSession} = require('../controllers/PaymentController')
const protect_2 = require('../middleware/auth_2')
const router = express.Router()

router.post('/courses', protect_2, CreateCheckoutSession)

module.exports = router