const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
    participantId : {type: mongoose.Schema.Types.ObjectId, ref: 'Participant'},
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    amount: {type: Number, required: true},
    currency: {type: String, default: 'eur'},
    status: {type: String,enum: ['succeeded', 'failed', 'pending'], required: true},
    createdAt: {type: Date, default: Date.now,},
    metadata: {type: mongoose.Schema.Types.Mixed},
})

const Payment = mongoose.model('Payment', PaymentSchema)

module.exports = Payment