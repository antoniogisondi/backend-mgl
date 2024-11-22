const User = require('../models/User')
const jwt = require ('jsonwebtoken')

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1h'})
}

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

exports.login = async (req,res) => {
    const {username, password} = req.body
    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).json({message:'Utente non trovato'})
        }

        const isMatch = user.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({message:'Password non corretta'})
        }
        const token = generateToken(user._id)
        res.json({token, username: user.username})
    } catch (error) {
        res.status(500).json({message:'Errore del server'})
    }
}