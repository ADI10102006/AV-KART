import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, Loader2, TrendingUp, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

const categories = ['All', 'Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Lifestyle'];
const sortOptions = [
  { label: 'Newest', value: 'created_at-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating', value: 'rating-desc' },
];

const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('created_at-desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    fetchProducts(0, true);
  }, [selectedCategory, sortBy, searchQuery]);

  useEffect(() => {
    if (page > 0) {
      fetchProducts(page, false);
    }
  }, [page]);

  const fetchProducts = async (pageNum: number, isInitial: boolean) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

    if (selectedCategory !== 'All') {
      query = query.eq('category', selectedCategory);
    }

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const [column, order] = sortBy.split('-');
    query = query.order(column, { ascending: order === 'asc' });

    const { data, count, error } = await query;

    if (data) {
      setProducts(prev => isInitial ? data : [...prev, ...data]);
      setHasMore(data.length === ITEMS_PER_PAGE);
    }
    
    setLoading(false);
    setLoadingMore(false);
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header & Search */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b dark:border-gray-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold dark:text-white">The Collection</h1>
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">
                500+ Items
              </span>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search premium jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all dark:text-white text-sm"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 glass-gold text-primary rounded-2xl font-bold transition-all hover:scale-105"
              >
                <SlidersHorizontal size={18} /> Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 space-y-8 sticky top-40 h-fit">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border dark:border-gray-800 shadow-sm">
              <h3 className="text-sm font-bold mb-6 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={16} className="text-primary" /> Categories
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border dark:border-gray-800 shadow-sm">
              <h3 className="text-sm font-bold mb-6 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" /> Sort By
              </h3>
              <div className="space-y-1">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      sortBy === opt.value
                        ? 'text-primary font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white dark:bg-gray-900 aspect-[4/5] rounded-[2.5rem]"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product, index) => (
                    <div 
                      key={product.id} 
                      ref={index === products.length - 1 ? lastProductRef : null}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
                
                {loadingMore && (
                  <div className="flex justify-center py-12">
                    <Loader2 className="text-primary animate-spin" size={32} />
                  </div>
                )}

                {!hasMore && products.length > 0 && (
                  <div className="text-center py-20">
                    <div className="w-12 h-1 bg-gray-200 dark:bg-gray-800 mx-auto mb-6 rounded-full" />
                    <p className="text-gray-500 dark:text-gray-400 font-light italic">You've reached the end of our current collection.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No jewelry found matching your search.</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="text-primary font-bold underline hover:text-primary-dark transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-950 z-[70] p-8 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold dark:text-white">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <X size={24} className="dark:text-white" />
                </button>
              </div>
              
              <div className="space-y-10">
                <div>
                  <h3 className="font-bold mb-6 dark:text-white uppercase tracking-widest text-xs">Categories</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                          selectedCategory === cat
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-6 dark:text-white uppercase tracking-widest text-xs">Sort By</h3>
                  <div className="space-y-2">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                          sortBy === opt.value
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-5 bg-primary text-white rounded-[2rem] font-bold shadow-xl shadow-primary/20 active:scale-95 transition-transform"
                >
                  Apply & View Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
