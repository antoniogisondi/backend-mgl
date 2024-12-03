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
        partecipanti,
    } = req.body

    try {

        if (!Array.isArray(durata_corso) || durata_corso.length === 0) {
            return res.status(400).json({ message: 'L\'array della durata del corso non può essere vuoto.' });
        }

        const today = new Date().setHours(0, 0, 0, 0);

        // Validazione: Tutte le date devono essere future
        const invalidDates = durata_corso.filter((day) => {
            const selectedDate = new Date(day.giorno);
            if (isNaN(selectedDate)) {
                console.error(`Data non valida: ${day.giorno}`);
                return true; // Considera non valida
            }
            const normalizedDate = selectedDate.setHours(0, 0, 0, 0);
            return normalizedDate <= today; // Ritorna true se la data è oggi o precedente
        });

        if (invalidDates.length > 0) {
            return res.status(400).json({
                message: 'Le date inserite nella durata del corso devono essere future.',
                invalidDates,
            });
        }

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
            durata_corso,
            data_richiesta: new Date(),
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


exports.UpdateCourse = async (req, res) => {
    const courseId = req.params.id;
    const { durata_corso, partecipanti, ...courseData } = req.body;

    console.log('Richiesta ricevuta:', req.body);

    try {
        // Validazione delle date di durata_corso
        if (Array.isArray(durata_corso) && durata_corso.length > 0) {
            durata_corso.forEach((entry) => {
                entry.giorno = new Date(entry.giorno); // Converte in oggetto Date
                if (isNaN(entry.giorno.getTime())) {
                    throw new Error(`Data non valida: ${entry.giorno}`);
                }
            });

            const today = new Date().setHours(0, 0, 0, 0);

            const invalidDates = durata_corso.filter((day) => {
                const selectedDate = new Date(day.giorno).setHours(0, 0, 0, 0);
                return selectedDate <= today;
            });

            if (invalidDates.length > 0) {
                return res.status(400).json({
                    message: 'Le date inserite nella durata del corso devono essere maggiori della data odierna.',
                });
            }
        }

        // Elaborazione dei partecipanti
        const processedParticipants = await Promise.all(
            partecipanti.map(async (participant) => {
                if (participant._id) {
                    // Aggiungi l'ID corso al partecipante esistente
                    await Participant.findByIdAndUpdate(
                        participant._id,
                        { $addToSet: { courseId: courseId } },
                        { new: true, runValidators: true }
                    );
                    return participant._id;
                } else {
                    // Crea un nuovo partecipante
                    const newParticipant = new Participant(participant);
                    const savedParticipant = await newParticipant.save();
                    return savedParticipant._id;
                }
            })
        );

        // Aggiorna il corso
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { ...courseData, partecipanti: processedParticipants, durata_corso },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Corso non trovato' });
        }

        // Recupera il corso aggiornato per assicurarsi che sia corretto
        const course = await Course.findById(updatedCourse._id);
        console.log('Durata corso aggiornata:', course.durata_corso);

        res.status(200).json({ course: updatedCourse });
    } catch (error) {
        console.error('Errore durante la modifica del corso:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};



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