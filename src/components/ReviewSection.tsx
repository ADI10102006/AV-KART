import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useStore();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (data) setReviews(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        user_id: user.id,
        user_name: user.full_name || 'Guest User',
        rating: newRating,
        comment: newComment
      });

      if (error) throw error;

      toast.success('Review posted successfully!');
      setNewComment('');
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
      if (error) throw error;
      toast.success('Review deleted');
      fetchReviews();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mt-20 border-t dark:border-gray-800 pt-16">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex-1 space-y-8 w-full">
          <h3 className="text-2xl font-bold dark:text-white flex items-center gap-3">
            <MessageSquare className="text-primary" /> Customer Reviews
          </h3>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />)}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border dark:border-gray-800"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold dark:text-white text-sm">{review.user_name}</p>
                        <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < review.rating ? 'currentColor' : 'none'}
                            className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      {(user?.id === review.user_id || user?.role === 'admin') && (
                        <button 
                          onClick={() => handleDelete(review.id)}
                          className="text-red-500 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed dark:border-gray-800">
              <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>

        <div className="w-full md:w-96">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border dark:border-gray-800 shadow-xl sticky top-24">
            <h4 className="text-xl font-bold dark:text-white mb-6">Write a Review</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold dark:text-gray-400">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        size={24}
                        fill={star <= newRating ? 'currentColor' : 'none'}
                        className={star <= newRating ? 'text-yellow-500' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold dark:text-gray-400">Your Thoughts</label>
                <textarea
                  required
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tell us about the quality and design..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 dark:text-white text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !user}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> Post Review
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
