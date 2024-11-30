'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const BORDER_COLORS = [
  'border-pink-500',
  'border-purple-500',
  'border-blue-500',
  'border-green-500',
  'border-yellow-500'
];

const TRANSITION_DURATION = 500;
const INTERVAL_DURATION = 5000;

const ReviewCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [slideDirection, setSlideDirection] = useState('left');
  const [timestamp, setTimestamp] = useState(Date.now());
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews);
          setAverageRating(data.averageRating);
          setTotalCount(data.totalCount);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const startCarousel = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (reviews.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(current => {
          const next = current === reviews.length - 1 ? 0 : current + 1;
          setSlideDirection('left');
          return next;
        });
      }, INTERVAL_DURATION);
    }
  }, [reviews.length]);

  // Start/restart carousel when reviews change
  useEffect(() => {
    startCarousel();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [reviews.length, startCarousel]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSlideDirection('left');
    setCurrentIndex(current => current === reviews.length - 1 ? 0 : current + 1);
    
    // Reset animation flag after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, TRANSITION_DURATION);

    // Restart the carousel timer
    startCarousel();
  }, [reviews.length, isAnimating, startCarousel]);

  const handlePrevious = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSlideDirection('right');
    setCurrentIndex(current => current === 0 ? reviews.length - 1 : current - 1);
    
    // Reset animation flag after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, TRANSITION_DURATION);

    // Restart the carousel timer
    startCarousel();
  }, [reviews.length, isAnimating, startCarousel]);

  const handleDotClick = useCallback((index) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setSlideDirection(index > currentIndex ? 'left' : 'right');
    setCurrentIndex(index);
    
    // Reset animation flag after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, TRANSITION_DURATION);

    // Restart the carousel timer
    startCarousel();
  }, [currentIndex, isAnimating, startCarousel]);

  const getAvatarSrc = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('data:')) return avatar;
    
    const filename = avatar.includes('/') 
      ? avatar.split('/').pop() 
      : avatar;
    
    return `/api/uploads/user-avatars/${filename}?t=${timestamp}`;
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
          Based on {totalCount} {totalCount === 1 ? 'review' : 'reviews'}
        </div>
      </div>

      {/* Review Carousel */}
      <div className="relative overflow-hidden">
        <div className="min-h-[200px] relative pt-2">
          {reviews.map((review, index) => {
            const isPrevious = index === (currentIndex === 0 ? reviews.length - 1 : currentIndex - 1);
            const isNext = index === ((currentIndex + 1) % reviews.length);
            
            return (
              <div
                key={review.id}
                className={`w-full absolute top-0 left-0 transition-transform duration-500 ease-in-out ${
                  index === currentIndex ? 'z-10' : 'z-0'
                }`}
                style={{
                  transform: `translateX(${
                    index === currentIndex 
                      ? '0%' 
                      : slideDirection === 'left'
                        ? isNext
                          ? '100%'
                          : '-100%'
                        : isPrevious
                          ? '-100%'
                          : '100%'
                  })`
                }}
              >
                <div className="text-center space-y-4 pt-1">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 ${
                        BORDER_COLORS[index % BORDER_COLORS.length]
                      }`}>
                        {review.user.avatar ? (
                          <Image
                            src={getAvatarSrc(review.user.avatar)}
                            alt={review.user.name}
                            fill
                            className="object-cover"
                            unoptimized={true}
                            priority
                            key={timestamp}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <i className="ri-user-line text-2xl text-gray-500 dark:text-gray-400"></i>
                          </div>
                        )}
                      </div>
                      <div className={`absolute -right-1 -top-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                        review.user.is_pro 
                          ? 'bg-purple-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {review.user.is_pro ? (
                          <i className="ri-vip-crown-fill text-[10px]"></i>
                        ) : (
                          <i className="ri-user-star-fill text-[10px]"></i>
                        )}
                      </div>
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
                  &quot;{review.review}&quot;
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {review.user.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              disabled={isAnimating}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 z-20 disabled:opacity-50"
            >
              <i className="ri-arrow-left-s-line text-xl"></i>
            </button>
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 z-20 disabled:opacity-50"
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
                disabled={isAnimating}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                } disabled:opacity-50`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCarousel;
