const express = require('express')
const {WebHook} = require('../controllers/WebHook')
const router = express.Router()

router.post('/webhook', express.raw({type: 'application/json'}), WebHook)

module.exports = router