'use client';

import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const PromotionModal = ({ promotion, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      {showConfetti && <ReactConfetti 
        recycle={false}
        numberOfPieces={200}
        onConfettiComplete={() => setShowConfetti(false)}
      />}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-pink-100 via-white to-blue-100 dark:from-indigo-950 dark:via-gray-900 dark:to-purple-950 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20 backdrop-blur"
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h3 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 dark:from-pink-400 dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2"
          >
            🎉 Special Offer! ✨
          </motion.h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="prose dark:prose-invert max-w-none mb-6"
        >
          {promotion.details.split('\n').map((paragraph, index) => (
            <p key={index} className="text-gray-600 dark:text-gray-300">{paragraph}</p>
          ))}
        </motion.div>

        {promotion.type === 'giveaway' && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-4 rounded-xl mb-6 border border-white/20"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <span>🎁</span>
              Remaining Pro Licenses: {promotion.remainingGiveaways} of {promotion.maxGiveaways}
            </p>
          </motion.div>
        )}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Close ✨
          </button>
        </motion.div>
      </motion.div>
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
          
          const active = promotions.find(promo => 
            new Date(promo.startDate) <= now && 
            new Date(promo.endDate) >= now &&
            (!promo.type === 'giveaway' || promo.remainingGiveaways > 0)
          );

          if (active) {
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
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed top-12 left-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white py-3 px-6 cursor-pointer z-[1998] flex items-center gap-3 rounded-r-xl shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        onClick={handleBannerClick}
      >
        <span className="text-2xl animate-bounce">🎁</span>
        <span className="text-sm font-medium">{activePromotion.description}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="ml-4 text-white/80 hover:text-white transition-colors"
        >
          <i className="ri-close-line"></i>
        </button>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <PromotionModal
            promotion={activePromotion}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
