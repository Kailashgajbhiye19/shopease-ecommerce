import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import axios from "../utils/axios";

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const cartItems = cart?.cartItems || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (err) {}
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <nav className="bg-[#1A3C6E] text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        🛒 ShopEase
      </Link>
      <div className="flex gap-6 items-center text-sm font-medium">
        <Link
          to="/cart"
          className="flex items-center gap-1 hover:text-orange-400 transition"
        >
          🛍️ Cart
          {cartItems.length > 0 && (
            <span className="bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs ml-1">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </Link>
        {userInfo ? (
          <>
            <span className="text-orange-300 font-semibold">
              👤 {userInfo.name}
            </span>
            <button
              onClick={logoutHandler}
              className="bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-orange-400 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-lg transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
