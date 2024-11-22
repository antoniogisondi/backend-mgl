const Course = require('../models/Course')

exports.createCourse = async (req,res) => {
    const { 
        nome_corso, 
        numero_partecipanti, 
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
            numero_partecipanti, 
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
        res.status(201).json({message: 'Successo', course: newCourse})

    } catch (error) {
        console.error('Errore durante la creazione del corso:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
}

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Errore durante il recupero dei corsi:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};