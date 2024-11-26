'use client';

import { useState, useEffect } from 'react';

const PromotionModal = ({ promotion, onClose }) => {
  if (!promotion) return null;

  const handleClick = async () => {
    try {
      await fetch('/api/settings/promotions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: promotion.id,
          action: 'open'
        }),
      });
    } catch (error) {
      console.error('Error tracking promotion click:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Special Promotion</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-6">
          {promotion.details.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {promotion.type === 'giveaway' && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remaining Pro Licenses: {promotion.remainingGiveaways} of {promotion.maxGiveaways}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PromotionBanner() {
  const [activePromotion, setActivePromotion] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkActivePromotion = async () => {
      try {
        const response = await fetch('/api/settings/promotions');
        if (response.ok) {
          const promotions = await response.json();
          const now = new Date();
          
          // Find the first active promotion
          const active = promotions.find(promo => 
            new Date(promo.startDate) <= now && 
            new Date(promo.endDate) >= now &&
            (!promo.type === 'giveaway' || promo.remainingGiveaways > 0)
          );

          if (active) {
            // Check if this promotion was recently closed
            const closedUntil = localStorage.getItem(`promo_closed_${active.id}`);
            if (closedUntil && new Date(closedUntil) > now) {
              setShowBanner(false);
            } else {
              setActivePromotion(active);
              setShowBanner(true);
            }
          } else {
            setActivePromotion(null);
            setShowBanner(false);
          }
        }
      } catch (error) {
        console.error('Error checking active promotions:', error);
      }
    };

    checkActivePromotion();
  }, []);

  const handleClose = async () => {
    if (!activePromotion) return;

    try {
      // Track the close action
      await fetch('/api/settings/promotions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activePromotion.id,
          action: 'close'
        }),
      });

      // Store the closed state for 24 hours
      const until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(`promo_closed_${activePromotion.id}`, until);
      
      setShowBanner(false);
    } catch (error) {
      console.error('Error tracking promotion close:', error);
    }
  };

  const handleBannerClick = () => {
    setShowModal(true);
  };

  if (!activePromotion || !showBanner) return null;

  return (
    <>
      <div 
        className="fixed top-12 left-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 cursor-pointer z-[1998] flex items-center gap-2 rounded-br-lg shadow-lg"
        onClick={handleBannerClick}
      >
        <i className="ri-gift-line text-xl"></i>
        <span className="text-sm font-medium">{activePromotion.description}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="ml-4 text-white/80 hover:text-white"
        >
          <i className="ri-close-line"></i>
        </button>
      </div>

      {showModal && (
        <PromotionModal
          promotion={activePromotion}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}