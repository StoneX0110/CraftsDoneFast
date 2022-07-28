const contractModel = require('../models/Contract')

const calculateAmount = (priceUSD) => {
    return priceUSD*100;
};

// returns all job offers of a specific user
exports.createPaymentIntent = (async (req, res) => {
    const stripe = require('stripe')('sk_test_51LFv4cGPYqiDG82L4wVgPAmMxa9d085aSrifwuJPyR9LrSBunr0HsEIO4JKCmjetkHKYbayXCAvAZ6cqFbTa8gwH00XPggZZQf');
    const contract = JSON.parse(req.body.body);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateAmount(contract.price),
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});
