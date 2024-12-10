const express = require('express')
const {} = require('../controllers/PaymentController')
const router = express.Router()
const protect_2 = require('../middleware/auth_2')

router.post('/courses', protect_2)