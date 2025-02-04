const mongoose = require('mongoose')

// Imposto lo schema del Model dei corsi
const CourseSchema = new mongoose.Schema({
    nome_corso: { type: String, required: true, maxlength: 255 },
    programma_corso: [
        {
            modulo: { type: String, required: true },
            descrizione: { type: String, required: true }, 
            durata: { type: Number, required: true},
        },
    ],
    costo: {type: Number, require: true},
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
    partecipanti: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant'}],
    data_richiesta: {type: Date, default: Date.now,  get: (v) => v.toISOString().split('T')[0]},
    status: { type: String, enum: ['Richiesto', 'Attivo', 'Completato'], default: 'Richiesto' },
})

CourseSchema.set('toJSON', {getters:true})
CourseSchema.set('toObject', {getters:true})

// Funzione che consente di creare il numero di autorizzazione del corso al momento della sua creazione
CourseSchema.pre('save', function (next) {
    if(!this.numero_autorizzazione){
        const prefix = 'MGL'
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        this.numero_autorizzazione = `${prefix}/${randomNumber}`
    }
    next();
})

module.exports = mongoose.model('Course', CourseSchema)