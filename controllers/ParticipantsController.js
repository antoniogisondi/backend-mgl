const Participant = require('../models/Participant')

exports.getAllParticipants = async (req, res) => {
    try {
        const selectParticipants = await Participant.find()

        if (!selectParticipants) {
            res.status(404).json({message: 'Partecipante non trovato'})
        }

        res.status(200).json(selectParticipants);
    } catch (error) {
        console.error('Errore durante la ricerca dei partecipanti:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};