const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create a Stripe Checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const { amount, productName } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: productName,
            },
            unit_amount: amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://your-frontend.com/success',
      cancel_url: 'https://your-frontend.com/cancel',
    });

    res.status(200).json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ success: false, message: 'Payment failed' });
  }
};

module.exports = { createCheckoutSession };