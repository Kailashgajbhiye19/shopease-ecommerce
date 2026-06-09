import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      );
      dispatch(setCredentials(data));
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-[#1A3C6E] mb-2 text-center">
        Welcome Back 👋
      </h2>
      <p className="text-gray-500 text-center text-sm mb-6">
        Sign in to your ShopEase account
      </p>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E] text-sm"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C6E] text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A3C6E] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        New customer?{" "}
        <Link
          to="/register"
          className="text-orange-500 font-medium hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
