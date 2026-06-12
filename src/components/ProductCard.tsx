import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    original_price?: number;
    image_url: string;
    rating: number;
    category: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-900 hover:bg-primary hover:text-white'
            }`}
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => addToCart({ ...product, quantity: 1 })}
            className="p-3 bg-white/80 text-gray-900 rounded-full backdrop-blur-md hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
        {product.original_price && (
          <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">₹{product.price}</span>
            {product.original_price && (
              <span className="text-sm text-gray-400 line-through">₹{product.original_price}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{product.rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
