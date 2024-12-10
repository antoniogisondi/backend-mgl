const Course = require('../models/Course');
const Participant = require('../models/Participant')
const {generateCertificate} = require('../utils/certificateGenerator')
const path = require('path')
const fs = require('fs')

// Recupero tutti i partecipanti
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

// Pagina di dettaglio del partecipante
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

// Modifica del partecipante
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

// Eliminazione del partecipante
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

exports.generateCourseCertificate = async (req,res) => {
    const { participantId, courseId } = req.body;

    try {
        // Verifica che il partecipante esiste
        const participant = await Participant.findById(participantId);
        if (!participant) {
            console.log('partecipante non trovato nel db')
            return res.status(404).json({ message: 'Partecipante non trovato' });
        }

        // Verifica che il corso esiste
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Corso non trovato' });
        }

        // Verifica che il corso sia completato
        if (course.status !== 'Completato') {
            return res.status(400).json({ message: 'Il corso non è ancora completato.' });
        }

        const pdfbuffer = await generateCertificate(participant, course);

        const certificatesDir = path.join(__dirname, '..', 'config', 'certificates');
        const certificatePath = path.join(certificatesDir, `Attestato_${courseId}.pdf`);

        fs.writeFileSync(certificatePath, pdfbuffer)

        // Invia il file come risposta
        res.setHeader('Content-Disposition', `attachment; filename="Attestato_${courseId}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        return res.sendFile(certificatePath, (err) => {
            if (err) {
                console.error('Errore durante l\'invio del file:', err);
                res.status(500).json({ message: 'Errore durante l\'invio del file.' });
            }
            fs.unlinkSync(certificatePath)
        });
    } catch (error) {
        console.error(error)
    }
}
