const mongoose = require('mongoose')

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Connesso al DB')
    } catch (error) {
        console.error('errore di connessione al database', error)
        process.exit(1)
    }
}

module.exports = connectDB