import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const OrderPage = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
        setOrder(data);
      } catch (err) {
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1A3C6E] mb-2">
        Order Confirmed! 🎉
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Order ID: <span className="font-mono text-gray-700">{order._id}</span>
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Order Items
            </h3>
            <div className="space-y-3">
              {order.orderItems.map((item, i) => (
                <div key={i} className="flex gap-4 items-center border-b pb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.qty} × ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-[#1A3C6E]">
                    ₹{(item.qty * item.price).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg mb-3 text-gray-800">
              Shipping Address
            </h3>
            <p className="text-gray-600 text-sm">
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
            <p className="mt-2">
              {order.isDelivered ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  ✅ Delivered
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                  🚚 Not Delivered Yet
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-3">
            Payment
          </h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span>Method</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              {order.isPaid ? (
                <span className="text-green-600 font-medium">✅ Paid</span>
              ) : (
                <span className="text-red-500 font-medium">❌ Not Paid</span>
              )}
            </div>
            <div className="flex justify-between font-bold text-[#1A3C6E] text-lg border-t pt-3 mt-3">
              <span>Total</span>
              <span>₹{order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
