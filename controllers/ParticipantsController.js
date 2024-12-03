const Course = require('../models/Course');
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

exports.getParticipantsById = async (req,res) => {
    try {
        const participantId = req.params.id
        const participant = await Participant.findById(participantId).populate(
            'courseId', 'nome_corso indirizzo_di_svolgimento cap_sede_corso città_di_svolgimento provincia direttore_corso docente_corso categoria_corso numero_autorizzazione durata_corso data_richiesta'
        )
        if (!participant) {
            return res.status(404).json({ message: 'Partecipante non trovato' });
        }
        res.status(200).json(participant);
    } catch (error) {
        console.error('Errore durante il recupero del partecipante:', error);
        res.status(500).json({ message: 'Errore del server', error });
    }
}

exports.updateParticipant = async (req,res) => {
    try {
        const participantId = req.params.id
        const update = req.body

        const updateParticipant = await Participant.findByIdAndUpdate(participantId, update, {new:true, runValidators:true})
        if (!updateParticipant) {
            return res.status(404).json({message: 'Partecipante non trovato'})
        }
        res.status(200).json({message: 'Partecipante modificato con successo'})
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del partecipante:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
}

exports.deleteParticipant = async (req,res) => {
    try {
        const participantId = req.params.id
        const participant = await Participant.findById(participantId)

        if (!participant) {
            return res.status(404).json({ message: 'Partecipante non trovato' });
        }

        await Course.updateMany(
            {partecipanti: participantId},
            {$pull: {partecipanti: participantId}}
        )

        await Participant.findByIdAndDelete(participantId)
        res.status(200).json({message:'Partecipante eliminato con successo'})
    } catch (error) {
        console.error('Errore durante l\'eliminazione del partecipante:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
}