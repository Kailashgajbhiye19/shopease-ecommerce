import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const categories = ["Electronics", "Clothing", "Books", "Home", "Sports"];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products?keyword=${keyword}&category=${category}`,
        );
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(search);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1A3C6E] to-[#2563eb] text-white rounded-2xl p-10 mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">
          Shop Smarter with ShopEase 🛒
        </h1>
        <p className="text-blue-200 mb-6 text-lg">
          Discover thousands of products at the best prices
        </p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:outline-none shadow-lg"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition
            ${category === "" ? "bg-[#1A3C6E] text-white border-[#1A3C6E]" : "border-gray-300 hover:border-[#1A3C6E] bg-white"}`}
        >
          All Products
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition
              ${category === c ? "bg-[#1A3C6E] text-white border-[#1A3C6E]" : "border-gray-300 hover:border-[#1A3C6E] bg-white"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-semibold">No products found</p>
          <p className="text-sm mt-2">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
