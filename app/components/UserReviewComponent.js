'use client';

import { useState, useEffect } from 'react';

const UserReviewComponent = ({ user, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    const fetchExistingReview = async () => {
      try {
        const response = await fetch(`/api/reviews/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setExistingReview(data);
            setRating(parseInt(data.rating));
            setReview(data.review);
          }
        }
      } catch (error) {
        console.error('Error fetching review:', error);
      }
    };

    if (user) {
      fetchExistingReview();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (review.length > 1000) {
      setMessage({ type: 'error', content: 'Review must be 1000 characters or less' });
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: existingReview ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(user.id),
          rating: parseInt(rating),
          review,
          reviewId: existingReview ? parseInt(existingReview.id) : undefined
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      setMessage({ type: 'success', content: `Review ${existingReview ? 'updated' : 'submitted'} successfully` });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage({ type: 'error', content: error.message || 'Failed to submit review' });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {existingReview ? 'Update Your Review' : 'Leave a Review'}
      </h3>

      {message.content && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-400'
            : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {message.content}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none"
              >
                <i className={`ri-star-${rating >= star ? 'fill' : 'line'} ${
                  rating >= star ? 'text-yellow-400' : 'text-gray-300'
                }`}></i>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            maxLength={1000}
            rows={4}
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            placeholder="Share your experience..."
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {review.length}/1000 characters
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2"
            disabled={!rating || !review.trim()}
          >
            <i className="ri-send-plane-line"></i>
            {existingReview ? 'Update' : 'Submit'} Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserReviewComponent;
