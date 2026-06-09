import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const StripePayment = ({ orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful! 🎉");
        onSuccess(paymentIntent);
      }
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition text-lg mt-4"
      >
        {loading ? "Processing..." : "💳 Pay Now"}
      </button>
      <p className="text-center text-xs text-gray-400 mt-2">
        🔒 Secured by Stripe · Test card: 4242 4242 4242 4242
      </p>
    </form>
  );
};

export default StripePayment;
