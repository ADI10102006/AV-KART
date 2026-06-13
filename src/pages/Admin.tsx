import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign,
  MessageSquare,
  Star,
  TrendingUp,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import ProductModal from '../components/Admin/ProductModal';

const Admin = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarLinks = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 hidden lg:block sticky top-20 h-[calc(100vh-5rem)]">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <TrendingUp size={18} />
            </div>
            <span className="font-bold dark:text-white">Admin Panel</span>
          </div>
          
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Management</p>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPath === link.path
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/analytics" element={<AdminAnalytics />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/reviews" element={<AdminReviews />} />
        </Routes>
      </main>
    </div>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [orders, products, users] = await Promise.all([
        supabase.from('orders').select('total_amount'),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('users').select('id', { count: 'exact' })
      ]);

      const sales = orders.data?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;
      
      setStats({
        totalSales: sales,
        totalOrders: orders.data?.length || 0,
        totalProducts: products.count || 0,
        totalUsers: users.count || 0
      });
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, icon: <DollarSign className="text-green-500" /> },
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag className="text-blue-500" /> },
    { label: 'Total Products', value: stats.totalProducts, icon: <Package className="text-primary" /> },
    { label: 'Total Customers', value: stats.totalUsers, icon: <Users className="text-purple-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold dark:text-white">Dashboard Overview</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-4 py-2 rounded-full border dark:border-gray-800">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
          >
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl w-fit mb-4">{card.icon}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
            <h3 className="text-2xl font-bold dark:text-white">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2rem] flex items-start gap-4">
        <AlertCircle className="text-primary shrink-0" />
        <div>
          <h4 className="font-bold text-primary mb-1">Welcome to AV KART Admin</h4>
          <p className="text-sm text-primary/80">Manage your jewelry catalog, track incoming orders, and respond to customer feedback all in one place.</p>
        </div>
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [stockData, setStockData] = useState<any[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data: products } = await supabase.from('products').select('category, stock, title');
      const { data: orders } = await supabase.from('orders').select('total_amount, created_at');

      if (products) {
        // Category Distribution
        const cats = products.reduce((acc: any, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {});
        setCategoryData(Object.entries(cats).map(([name, value]) => ({ name, value })));

        // Stock Status (Low stock items)
        const lowStock = products.filter(p => p.stock < 10).slice(0, 10);
        setStockData(lowStock.map(p => ({ name: p.title.slice(0, 15), value: p.stock })));
      }

      if (orders) {
        // Revenue Trend (Mocking monthly grouping)
        const revenue = orders.reduce((acc: any, o) => {
          const date = new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short' });
          acc[date] = (acc[date] || 0) + Number(o.total_amount);
          return acc;
        }, {});
        setRevenueTrend(Object.entries(revenue).map(([name, value]) => ({ name, value })));
      }

      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: '0%', left: 'center', textStyle: { color: '#888' } },
    series: [{
      name: 'Categories',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: 'transparent', borderWidth: 2 },
      label: { show: false },
      data: categoryData,
      color: ['#B8860B', '#DAA520', '#996515', '#FFD700', '#F0E68C']
    }]
  };

  const lineOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: revenueTrend.map(d => d.name), axisLine: { lineStyle: { color: '#888' } } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#888' } }, splitLine: { lineStyle: { color: '#222' } } },
    series: [{
      data: revenueTrend.map(d => d.value),
      type: 'line',
      smooth: true,
      lineStyle: { color: '#B8860B', width: 4 },
      areaStyle: { color: 'rgba(184, 134, 11, 0.1)' },
      symbol: 'none'
    }]
  };

  const barOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: stockData.map(d => d.name), axisLabel: { rotate: 45, color: '#888' } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#888' } } },
    series: [{
      data: stockData.map(d => d.value),
      type: 'bar',
      itemStyle: { color: '#DAA520', borderRadius: [5, 5, 0, 0] }
    }]
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold dark:text-white">Sales & Inventory Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" /> Revenue Trend
          </h3>
          <ReactECharts option={lineOption} style={{ height: '300px' }} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-primary" /> Category Distribution
          </h3>
          <ReactECharts option={pieOption} style={{ height: '300px' }} />
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" /> Low Stock Inventory (Top 10)
          </h3>
          <ReactECharts option={barOption} style={{ height: '350px' }} />
        </div>
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(100);
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Product deleted successfully'); fetchProducts(); }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Product Catalog</h1>
          <p className="text-gray-500 dark:text-gray-400">Showing latest 100 jewelry pieces</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} 
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4 h-16 bg-gray-50/50 dark:bg-gray-800/20"></td>
                  </tr>
                ))
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url} className="w-12 h-12 rounded-xl object-cover border dark:border-gray-700" alt="" />
                      <span className="font-bold dark:text-white truncate max-w-[200px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-medium dark:text-gray-300">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">₹{p.price}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${p.stock < 10 ? 'text-red-500' : 'dark:text-gray-300'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} 
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchProducts} product={editingProduct} />
    </div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold dark:text-white">Customer Orders</h1>
      <div className="bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">#{o.id.slice(0,8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <div className="dark:text-white font-medium">{o.customer_name}</div>
                    <div className="text-xs text-gray-500">{o.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">₹{o.total_amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      o.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                      o.status === 'Shipped' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      onChange={(e) => updateStatus(o.id, e.target.value)} 
                      value={o.status} 
                      className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase.from('reviews').select('*, products(title)').order('created_at', { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this customer review?')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Review removed');
      fetchReviews();
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold dark:text-white">Customer Feedback</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((r) => (
          <motion.div 
            key={r.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border dark:border-gray-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {r.user_name[0]}
                  </div>
                  <div>
                    <span className="font-bold dark:text-white block">{r.user_name}</span>
                    <span className="text-xs text-gray-500">on {r.products?.title}</span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteReview(r.id)} 
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="flex gap-1 mb-3 text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < r.rating ? 'currentColor' : 'none'} />)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{r.comment}"</p>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-800 text-[10px] text-gray-400 uppercase tracking-widest">
              Posted on {new Date(r.created_at).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default Admin;
