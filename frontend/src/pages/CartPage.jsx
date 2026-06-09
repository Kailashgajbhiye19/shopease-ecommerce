import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, addToCart } from "../redux/slices/cartSlice";
import { useNavigate, Link } from "react-router-dom";

const CartPage = () => {
  const cartState = useSelector((state) => state.cart);
  const cartItems = cartState?.cartItems || [];
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1A3C6E] mb-6">
        🛍️ Shopping Cart
      </h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-xl font-semibold text-gray-700">
            Your cart is empty
          </p>
          <Link
            to="/"
            className="mt-4 inline-block bg-[#1A3C6E] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow p-4 flex gap-4 items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <Link
                    to={`/product/${item._id}`}
                    className="font-semibold text-gray-800 hover:text-[#1A3C6E] transition"
                  >
                    {item.name}
                  </Link>
                  <p className="text-orange-500 font-bold mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>
                <select
                  value={item.qty}
                  onChange={(e) =>
                    dispatch(
                      addToCart({ ...item, qty: Number(e.target.value) }),
                    )
                  }
                  className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]"
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-red-400 hover:text-red-600 font-bold text-2xl transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-3">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Items ({cartItems.reduce((a, c) => a + c.qty, 0)})</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹0</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-[#1A3C6E] text-lg border-t pt-3 mb-4">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={checkoutHandler}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Proceed to Checkout →
            </button>
            <Link
              to="/"
              className="block text-center text-sm text-[#1A3C6E] mt-3 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
