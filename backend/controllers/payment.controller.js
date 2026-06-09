const Stripe = require("stripe");

const createPaymentIntent = async (req, res) => {
  try {
    // Check if Stripe key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        message: "Stripe secret key is not configured",
      });
    }

    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent };
