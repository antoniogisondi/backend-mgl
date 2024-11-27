const Course = require('../models/Course')
const Participant = require('../models/Participant')

exports.createCourse = async (req,res) => {
    const { 
        nome_corso, 
        partecipanti, 
        programma_corso, 
        indirizzo_di_svolgimento, 
        cap_sede_corso,  
        città_di_svolgimento,
        provincia,
        direttore_corso,
        docente_corso,
        categoria_corso,
        numero_autorizzazione,
        durata_corso
    } = req.body

    try {
        const newCourse = new Course({
            nome_corso,
            programma_corso, 
            indirizzo_di_svolgimento, 
            cap_sede_corso,  
            città_di_svolgimento,
            provincia,
            direttore_corso,
            docente_corso,
            categoria_corso,
            numero_autorizzazione,
            durata_corso
        })

        await newCourse.save()

        const participantsWithCourse = partecipanti.map((p) => ({
            ...p,
            corso: newCourse._id
        }))

        const savedParticipants = await Participant.insertMany(participantsWithCourse)
        res.status(201).json({message: 'Successo', course: newCourse, partecipanti: savedParticipants})

    } catch (error) {
        console.error('Errore durante la creazione del corso:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
}

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().select('_id nome_corso numero_autorizzazione categoria_corso');
        res.status(200).json(courses);
    } catch (error) {
        console.error('Errore durante il recupero dei corsi:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

exports.getCourseDetails = async (req,res) => {
    try {
        const courseId = req.params.id;

        // Recupera il corso
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Corso non trovato' });
        }

        // Recupera i partecipanti associati al corso
        const partecipanti = await Participant.find({ corso: course._id });

        res.status(200).json({ course, partecipanti });
    } catch (error) {
        console.error('Errore durante il recupero del corso:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
}


exports.UpdateCourse = async (req,res) => {
    console.log('UpdateCourse chiamato');
    console.log('ID Corso:', req.params.id);
    console.log('Dati ricevuti:', req.body);
    const courseId = req.params.id
    const update = req.body

    try {
        const updatedCourse = await Course.findByIdAndUpdate(courseId, update, {
            new: true,
            runValidators: true
        })

        if (!updatedCourse) {
            return res.status(400).json({ message:'Corso non trovato'})
        }

        res.status(200).json({course: updatedCourse})
    } catch (error) {
        console.error('Errore durante la modifica del corso:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
}


exports.DeleteCourse = async (req,res) => {

    try {
        const {id} = req.params
        const deletedCourse = Course.findByIdAndDelete(id)
    
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Corso non trovato' });
        }
    
        res.status(200).json({ message: 'Corso eliminato con successo' });
    } catch (error) {
        console.error('Errore durante l\'eliminazione del corso:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
}