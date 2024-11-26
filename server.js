const express = require('express')
const methodOverride = require('method-override');
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const port = process.env.PORT || 5000
dotenv.config()

const app = express()
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cors())
app.use(bodyParser.json())

const authRoutes = require('./routes/auth')
const courseRoutes = require('./routes/courses')
const private = require('./routes/private')

app.use('/api', private)
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
connectDB()
