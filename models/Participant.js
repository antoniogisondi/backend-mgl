const mongoose = require('mongoose')

const ParticipantSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    email: { type: String },
    data_nascita: { type: Date, required: true },
    comune_nascita: { type: String, required: true },
    provincia_comune_nascita: { type: String, required: true },
    mansione: { type: String },
    azienda: { type: String },
    partita_iva_azienda: { type: String },
    courseId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required:true }],
})

module.exports = mongoose.model('Participant', ParticipantSchema)