const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const port = process.env.PORT || 5000
dotenv.config()
connectDB()
const app = express()
console.log(port)
app.use(cors())
app.use(bodyParser.json())

const authRoutes = require('./routes/auth')
const private = require('./routes/private')
app.use('/api/auth', authRoutes)
app.use('/api', private)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

