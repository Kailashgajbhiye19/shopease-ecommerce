import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { clearCart, saveShippingAddress } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import StripePayment from "../components/StripePayment";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const cartState = useSelector((state) => state.cart);
  const cartItems = cartState?.cartItems || [];
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(saveShippingAddress({ address, city, postalCode, country }));

      const { data: order } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          orderItems: cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id,
          })),
          shippingAddress: {
            address: address,
            city: city,
            postalCode: postalCode,
            country: country,
          },
          paymentMethod: "Stripe",
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: total,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      setOrderId(order._id);

      const { data: payment } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-payment-intent`,
        { amount: total },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      setClientSecret(payment.clientSecret);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/pay`,
        {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      dispatch(clearCart());
      navigate(`/order/${orderId}`);
    } catch (err) {
      toast.error("Payment recorded but order update failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1A3C6E] mb-6">
        {step === 1 ? "🚚 Shipping Details" : "💳 Payment"}
      </h2>

      {/* Steps Indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step >= 1 ? "text-[#1A3C6E]" : "text-gray-400"}`}
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${step >= 1 ? "bg-[#1A3C6E]" : "bg-gray-300"}`}
          >
            1
          </span>
          Shipping
        </div>
        <div className="flex-1 h-0.5 bg-gray-200">
          <div
            className={`h-full bg-[#1A3C6E] transition-all ${step >= 2 ? "w-full" : "w-0"}`}
          ></div>
        </div>
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step >= 2 ? "text-[#1A3C6E]" : "text-gray-400"}`}
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${step >= 2 ? "bg-[#1A3C6E]" : "bg-gray-300"}`}
          >
            2
          </span>
          Payment
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
          {step === 1 ? (
            <>
              <h3 className="font-bold text-lg mb-4 text-gray-800">
                Shipping Address
              </h3>
              <form onSubmit={placeOrderHandler} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Street Address
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E] text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Raipur"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E] text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      placeholder="492001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E] text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E] text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A3C6E] hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
                >
                  {loading ? "Processing..." : "Continue to Payment →"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h3 className="font-bold text-lg mb-4 text-gray-800">
                Complete Payment
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
                🧪 <b>Test Card:</b> 4242 4242 4242 4242 · Any future date · Any
                CVV
              </div>
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePayment
                    orderId={orderId}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              )}
              <button
                onClick={() => setStep(1)}
                className="mt-4 text-sm text-[#1A3C6E] hover:underline"
              >
                ← Back to Shipping
              </button>
            </>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-3">
            Order Summary
          </h3>
          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between text-sm text-gray-600"
              >
                <span className="truncate flex-1 mr-2">
                  {item.name} × {item.qty}
                </span>
                <span className="font-medium">
                  ₹{(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-500">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-[#1A3C6E] text-lg mt-2">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
