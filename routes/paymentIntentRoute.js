import Stripe from 'stripe';

export default async function paymentIntentRoutes(app, options) {
    app.post('/create-payment-intent', async (request, reply) => {
        const {stripe} = options;
        // Handle CORS
        reply.header('Access-Control-Allow-Origin', 'http://localhost:5173')
            .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            .header('Access-Control-Allow-Headers', 'Content-Type');

        // Handle OPTIONS preflight
        if (request.method === 'OPTIONS') {
            return reply.send();
        }

        try {
            const { amount, currency } = request.body;
            
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: currency,
            });

            return { 
                clientSecret: paymentIntent.client_secret 
            };
            
        } catch (err) {
            app.log.error(err);
            reply.status(500).send({ error: err.message });
        }
    });
}