const mongoose = require('mongoose')

// Imposto lo chema del model dei partecipanti
const ParticipantSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    codice_fiscale: {type: String, required: true, unique: true, validate: {validator: function (v){return /^[A-Z0-9]{16}$/i.test(v)}}, message: (props) => `Il codice fiscale non è valido`},
    email: { type: String },
    data_nascita: { type: Date, required: true,  get: (v) => v.toLocaleDateString('it-IT')},
    comune_nascita: { type: String, required: true },
    provincia_comune_nascita: { type: String, required: true },
    mansione: { type: String },
    azienda: { type: String },
    partita_iva_azienda: { type: String },
    courseId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required:true }],
})

ParticipantSchema.set('toJSON', {getters:true})
ParticipantSchema.set('toObject', {getters:true})

module.exports = mongoose.model('Participant', ParticipantSchema)