const mongoose = require('mongoose')
const Payment = require('../models/Payment')
const Participant = require('../models/Participant')
const whSecret = process.env.WH_SECRET
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.WebHook = async (req,res) => {
    const sig = req.headers['stripe-signature']

    let event

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, whSecret)
    } catch (error) {
        
        console.error('Errore nella validazione del webhook:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if(event.type === 'checkout.session.completed'){
        const session = event.data.object

        console.log('Pagamento completato', session)

        const paymentData = {
            participantId: session.metadata.participantId,
            courseId: session.metadata.courseId,
            amount: session.metadata.costo,
            status: 'succeeded',
            metadata: session.metadata
        }

        try {
            const payment = await Payment.create(paymentData);
            const participantId = new mongoose.Types.ObjectId(session.metadata.participantId)
            await Participant.findByIdAndUpdate(participantId, {$push: {payments: payment._id}}, {new:true})
        } catch (err) {
            console.error('Errore durante il salvataggio del pagamento:', err.message);
        }
    }
    res.json({received:true})
}
