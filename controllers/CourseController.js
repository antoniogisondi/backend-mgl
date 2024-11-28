const Course = require('../models/Course')
const Participant = require('../models/Participant')

exports.createCourse = async (req,res) => {
    const { 
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
        durata_corso,
        partecipanti
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

        const partecipantiIds = []

        for (const partecipante of partecipanti) {
            let existingParticipants = await Participant.findById(partecipante._id)

            if (existingParticipants) {
                
                if(!existingParticipants.courseId.includes(newCourse._id)){
                    existingParticipants.courseId.push(newCourse._id)
                    await existingParticipants.save()
                }
            } else {
                const newParticipants = new Participant({
                    ...partecipante,
                    courseId: [newCourse._id]
                })
                await newParticipants.save()
                existingParticipants = newParticipants
            }

            partecipantiIds.push(existingParticipants._id)
            
        }

        newCourse.partecipanti = partecipantiIds
        await newCourse.save()

        res.status(201).json({message: 'Successo', course: newCourse })

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
        const course = await Course.findById(courseId).populate('partecipanti');
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
    const courseId = req.params.id
    const {partecipanti, ...courseData} = req.body
    const update = req.body

    try {
        const processedParticipants = await Promise.all(
            partecipanti.map(async (participant) => {
                if (participant._id) {
                    // Se il partecipante ha già un ID, restituisci l'ID
                    return participant._id;
                } else {
                    // Se il partecipante è nuovo, salvalo e restituisci il nuovo ID
                    const newParticipant = new Participant(participant);
                    const savedParticipant = await newParticipant.save();
                    return savedParticipant._id;
                }
            })
        );

        // Aggiorna il corso
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { ...courseData, partecipanti: processedParticipants },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Corso non trovato' });
        }

        res.status(200).json({ course: updatedCourse });
    } catch (error) {
        console.error('Errore durante la modifica del corso:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
}


exports.DeleteCourse = async (req,res) => {
    const {id} = req.params
    try {
        const course = await Course.findById(id);
        const deletedCourse = await Course.findByIdAndDelete(id)
    
        if (!course) {
            return res.status(404).json({ message: 'Corso non trovato' });
        }

        await Course.findByIdAndDelete(id)

        await Participant.updateMany(
            {courseId: id},
            {$unset: {courseId: ''}}
        )
    
        res.status(200).json({ message: 'Corso eliminato con successo' });
    } catch (error) {
        console.error('Errore durante l\'eliminazione del corso:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
}