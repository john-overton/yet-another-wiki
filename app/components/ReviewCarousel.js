'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const BORDER_COLORS = [
  'border-pink-500',
  'border-purple-500',
  'border-blue-500',
  'border-green-500',
  'border-yellow-500'
];

const ReviewCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews);
          setAverageRating(data.averageRating);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Auto-advance carousel every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((current) => 
        current === reviews.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((current) => 
      current === 0 ? reviews.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((current) => 
      current === reviews.length - 1 ? 0 : current + 1
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Average Rating Display */}
      <div className="text-center mb-8">
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex justify-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className={`ri-star-${
                star <= Math.round(averageRating) ? 'fill' : 'line'
              } text-yellow-400 text-xl`}
            ></i>
          ))}
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </div>
      </div>

      {/* Review Carousel */}
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex items-center justify-center min-h-[200px]">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`w-full transition-opacity duration-300 absolute ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ display: index === currentIndex ? 'block' : 'none' }}
              >
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 ${
                      BORDER_COLORS[index % BORDER_COLORS.length]
                    }`}>
                      {review.user.avatar ? (
                        <Image
                          src={review.user.avatar}
                          alt={review.user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <i className="ri-user-line text-2xl text-gray-500 dark:text-gray-400"></i>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`ri-star-${
                          star <= review.rating ? 'fill' : 'line'
                        } text-yellow-400`}
                      ></i>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    "{review.review}"
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {review.user.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i className="ri-arrow-left-s-line text-xl"></i>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i className="ri-arrow-right-s-line text-xl"></i>
            </button>
          </>
        )}

        {/* Dots Navigation */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCarousel;
