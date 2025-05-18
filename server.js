import Fastify from 'fastify';
import paymentIntentRoutes from './routes/paymentIntentRoute.js';
import env from '@fastify/env';
import cors from '@fastify/cors';
import Stripe from 'stripe';

const app = Fastify({
    logger: true,
});

await app.register(env, {
    schema: {
        type: 'object',
        required: ['STRIPE_SECRET_KEY'],
        properties: {
            STRIPE_SECRET_KEY: {
                type: 'string',
            },
        },
    }
})

await app.register(cors, {
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type'] // Allowed headers
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.register(paymentIntentRoutes, { prefix: '/api', stripe });


app.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server running on ${address}`);
});