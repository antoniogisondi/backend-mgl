const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Payment = require('../models/Payment')

exports.CreateCheckoutSession = async (req,res) => {
    const {participantId, courseId} = req.body

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Pagamento per il corso ${courseId}`,
                        },
                        unit_amount: 100 * 100, // Stripe usa i centesimi
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                courseId,
                participantId,
            },
        })

        res.status(200).json({url: session.url, id: session.id})
    } catch (error) {
        console.error('Errore durante la creazione della sessione di pagamento:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
}
