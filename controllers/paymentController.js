const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Stripe = require('stripe');
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.error("❌ STRIPE_SECRET_KEY is missing in environment variables");
  throw new Error("Stripe key is not defined");
}

const stripe = Stripe(stripeKey);

// ✅ Stripe Checkout Session (recommended for full pages)
exports.createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sunkane Lane Mystery Game Pass',
              description: 'Access to full game session',
            },
            unit_amount: 499, // $4.99 in cents
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/payment-success',
      cancel_url: 'http://localhost:3000/payment-cancel',
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe Checkout Session Error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
