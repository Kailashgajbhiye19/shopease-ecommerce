import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="overflow-hidden-hidden h-52 bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover : scale-105 trnasition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="text-yellow-400 text-sm mb-2">
          {"★".repeat(Math.round(product.rating))}
          {"☆".repeat(5 - Math.round(product.rating))}
          <span className="text-gray-400 text-xs ml-1">
            ({product.numReviews})
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#1A3C6E] font-bold text-lg">
            ₹{product.price.toLocaleString()}
          </span>
          <Link
            to={`/product/${product._id}`}
            className="bg-[#1A3C6E] hover:bg-blue-800 text-white text-xs px-4 py-2 rounded-lg transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
