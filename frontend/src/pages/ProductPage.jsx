import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../utils/axios";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        toast.error("Product not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Added to cart!");
    navigate("/cart");
  };

  if (loading) return <Loader />;
  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-[#1A3C6E] hover:underline flex items-center gap-1 text-sm"
      >
        ← Back
      </button>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-gray-50 p-8 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-80 object-contain rounded-xl"
            />
          </div>
          {/* Details */}
          <div className="p-8">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              {product.category} · {product.brand}
            </p>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              {product.name}
            </h1>
            <div className="text-yellow-400 text-lg mb-3">
              {"★".repeat(Math.round(product.rating))}
              {"☆".repeat(5 - Math.round(product.rating))}
              <span className="text-gray-400 text-sm ml-2">
                ({product.numReviews} reviews)
              </span>
            </div>
            <p className="text-3xl font-bold text-[#1A3C6E] mb-4">
              ₹{product.price.toLocaleString()}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {product.description}
            </p>
            <div className="flex items-center gap-2 mb-4 text-sm">
              <span className="font-medium text-gray-700">Status:</span>
              {product.countInStock > 0 ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  ✅ In Stock ({product.countInStock} left)
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                  ❌ Out of Stock
                </span>
              )}
            </div>
            {product.countInStock > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Qty:
                </label>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C6E]"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition text-lg"
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
