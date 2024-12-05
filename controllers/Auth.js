const User = require('../models/User')
const Participant = require('../models/Participant')
const jwt = require ('jsonwebtoken')
const bcrypt = require('bcryptjs')

// generazione del token JWT
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1h'})
}

// Funzione per la registrazione
exports.register = async (req, res) =>{
    const {name, surname, username, password} = req.body

    try {
        const userExists = await User.findOne({username})
        if(userExists){
            return res.status(400).json({message: 'L\'utente esiste già'})
        }
        const user = await User.create({name, surname, username, password})
        const token = generateToken(user._id)
        res.status(200).json({message:'L\'utente è stato creato con successo'})
    } catch (error) {
        res.status(500).json({message:'Errore del server'})
    }
}

// Funzione per il login
exports.login = async (req,res) => {
    const {username, password} = req.body
    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).json({message:'Utente non trovato'})
        }

        const comparePw = await bcrypt.compare(password, user.password)

        if (!comparePw) {
            res.status(401).json({message: 'Credenziali non valide'})
        }

        const token = generateToken(user._id)
        res.json({token, username: user.username})
    } catch (error) {
        res.status(500).json({message:'Errore del server'})
    }
}

exports.participantLogin = async (req,res) => {
    const { nome, cognome, codice_fiscale } = req.body

    try {
        const participant = await Participant.findOne({nome, cognome, codice_fiscale}).populate('courseId')
        if (!participant) {
            return res.status(404).json({message: 'Partecipante non trovato'})
        }

        const token = jwt.sign({ id: participant._id, role: 'participant' },process.env.JWT_SECRET_2,{ expiresIn: '1d' });
        res.status(200).json({message: 'Accesso effettuato con successo',token, participant});
        console.log(req.body)
    } catch (error) {
        console.error('Errore durante il login del partecipante:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
}