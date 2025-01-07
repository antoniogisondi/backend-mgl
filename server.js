const express = require('express')
const methodOverride = require('method-override');
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const port = process.env.PORT || 5000
dotenv.config()
require('./utils/cron-jobs')
const app = express()

// ROTTA DEL WEBHOOK
const webhook = require('./routes/webhook')
app.use(webhook)


app.use(express.json());
app.use(methodOverride('_method'));
app.use(cors({origin: process.env.FRONTEND_URL , methods: 'GET,POST,PUT,DELETE', credentials: true,}))
app.use(bodyParser.json())


// Importazione delle rotte
const authRoutes = require('./routes/auth')
const courseRoutes = require('./routes/courses')
const participantsRoutes = require('./routes/participants')
const paymentRoutes = require('./routes/payments')
const private = require('./routes/private')

// Montaggio delle rotte
app.use('/api', private)
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/participants', participantsRoutes)
app.use('/api/payments', paymentRoutes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
connectDB()
