const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    nome_corso: { type: String, required: true, maxlength: 255 },
    numero_partecipanti: { type: Number, required: true },
    programma_corso: [
        {
            modulo: { type: String, required: true }, // Nome del modulo
            lezioni: [
                {
                    titolo: { type: String, required: true }, // Titolo della lezione
                    descrizione: { type: String }, // Descrizione opzionale
                    durata: { type: Number }, // Durata in minuti
                },
            ],
        },
    ],
    indirizzo_di_svolgimento: { type: String, required: true, maxlength: 40,},
    cap_sede_corso: { type: Number, required: true },
    città_di_svolgimento: { type: String, required: true, maxlength: 25 },
    provincia: { type: String, required: true, maxlength: 2 },
    direttore_corso: { type: String, required: true, maxlength: 35 },
    docente_corso: { type: String, required: true, maxlength: 35 },
    categoria_corso: { type: String, required: true, maxlength: 255 },
    numero_autorizzazione: { type: String, unique: true },
    durata_corso: [
        {
            giorno: { type: Date, required: true }, // Giorno specifico
            durata_ore: { type: Number, required: true }, // Durata in ore per quel giorno
        },
    ],
})

CourseSchema.pre('save', function (next) {
    if(!this.numero_autorizzazione){
        const prefix = 'MGL'
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        this.numero_autorizzazione = `${prefix}/${randomNumber}`
    }
    next();
})

module.exports = mongoose.model('Course', CourseSchema)