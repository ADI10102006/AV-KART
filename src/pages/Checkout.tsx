import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, CreditCard, CheckCircle, ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const Checkout = () => {
  const { cart, clearCart, user } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: user?.full_name || '',
    customer_email: user?.email || '',
    phone: '',
    address: '',
    payment_method: 'Credit Card',
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('orders').insert({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        phone: formData.phone,
        address: formData.address,
        payment_method: formData.payment_method,
        total_amount: total,
        order_items: cart,
        status: 'Processing'
      });

      if (error) throw error;

      toast.success('Order placed successfully!');
      setStep(3);
      clearCart();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="text-2xl font-bold dark:text-white mb-4">Your cart is empty</h2>
        <Link to="/shop" className="text-primary font-bold underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-12">
          {[
            { id: 1, label: 'Shipping', icon: <Truck size={18} /> },
            { id: 2, label: 'Payment', icon: <CreditCard size={18} /> },
            { id: 3, label: 'Success', icon: <CheckCircle size={18} /> },
          ].map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step >= s.id ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                }`}>
                  {s.icon}
                </div>
                <span className={`text-xs font-bold ${step >= s.id ? 'text-primary' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-20 h-0.5 mx-4 ${step > s.id ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm">
              <h2 className="text-2xl font-bold dark:text-white mb-6">Shipping Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium dark:text-gray-300">Full Name</label>
                    <input
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium dark:text-gray-300">Phone Number</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-gray-300">Email Address</label>
                  <input
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-gray-300">Delivery Address</label>
                  <textarea
                    name="address"
                    rows={4}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.address || !formData.phone}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold mt-6 disabled:opacity-50"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
            <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-primary transition-colors">
                <ArrowLeft size={18} /> Back to Shipping
              </button>
              <h2 className="text-2xl font-bold dark:text-white mb-6">Payment Method</h2>
              <div className="space-y-4">
                {['Credit Card', 'UPI / NetBanking', 'Cash on Delivery'].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.payment_method === method 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-100 dark:border-gray-800 hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.payment_method === method ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {formData.payment_method === method && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                      <span className="font-bold dark:text-white">{method}</span>
                    </div>
                    <input
                      type="radio"
                      name="payment_method"
                      className="hidden"
                      checked={formData.payment_method === method}
                      onChange={() => setFormData({ ...formData, payment_method: method })}
                    />
                  </label>
                ))}
                
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl mt-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    By clicking "Complete Order", you agree to our terms and conditions. Your payment information is processed securely.
                  </p>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Complete Order'}
                  </button>
                </div>
              </div>
            </div>
            <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white dark:bg-gray-900 p-12 rounded-[3rem] border dark:border-gray-800 shadow-2xl max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={48} />
            </div>
            <h1 className="text-4xl font-bold dark:text-white mb-4">Thank You!</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Your order has been placed successfully. We've sent a confirmation email to <span className="font-bold text-primary">{formData.customer_email}</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all">
                Continue Shopping
              </Link>
              <Link to="/" className="px-8 py-4 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-full font-bold hover:bg-gray-200 transition-all">
                Back to Home
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const OrderSummary = ({ subtotal, shipping, total }: any) => (
  <div className="lg:col-span-1">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm sticky top-24">
      <h3 className="text-lg font-bold dark:text-white mb-4">Order Summary</h3>
      <div className="space-y-3 pb-4 border-b dark:border-gray-800">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span className="font-bold dark:text-white">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          <span className="font-bold dark:text-white">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <span className="font-bold dark:text-white">Total</span>
        <span className="text-xl font-bold text-primary">₹{total}</span>
      </div>
    </div>
  </div>
);

export default Checkout;
