'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ReactConfetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';
import PromotionalRegisterModal from './PromotionalRegisterModal';

const PromotionModal = ({ promotion, onClose, hasProLicense }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
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

  if (showRegisterModal) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
          <PromotionalRegisterModal
            onClose={onClose}
            onShowLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={onClose}>
      {showConfetti && !hasProLicense && <ReactConfetti 
        recycle={false}
        numberOfPieces={200}
        onConfettiComplete={() => setShowConfetti(false)}
      />}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-pink-100 via-white to-blue-100 dark:from-indigo-950 dark:via-gray-900 dark:to-purple-950 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20 backdrop-blur"
        onClick={e => e.stopPropagation()}
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
          {hasProLicense ? (
            <p className="text-gray-600 dark:text-gray-300">
              You already have a Pro License! 🌟<br /><br />
              Know someone who could benefit from Yet Another Wiki? Share this promotion with them and help them get started with a Pro License! 🎁
            </p>
          ) : (
            promotion.details.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-300">{paragraph}</p>
            ))
          )}
        </motion.div>

        {promotion.type === 'giveaway' && !hasProLicense && (
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
          className="flex justify-end gap-3"
        >
          {promotion.type === 'giveaway' && (
            <button
              onClick={() => {
                if (!hasProLicense) {
                  handleClick();
                  setShowRegisterModal(true);
                }
              }}
              disabled={hasProLicense}
              className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
                hasProLicense ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {hasProLicense ? 'Already Claimed ✨' : 'Claim Your Pro License ✨'}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Close ✨
          </button>
        </motion.div>
      </motion.div>

      {showLoginModal && (
        <LoginModal 
          isOpen={true} 
          onClose={() => {
            setShowLoginModal(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default function PromotionBanner() {
  const { data: session, status } = useSession();
  const [activePromotion, setActivePromotion] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [hasProLicense, setHasProLicense] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            const userData = await response.json();
            setHasProLicense(userData.is_pro || false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setHasProLicense(false);
      }
    };

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

    fetchUserData();
    checkActivePromotion();

    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [status]);

  const handleCloseBanner = async () => {
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
      setShowModal(false);
    } catch (error) {
      console.error('Error tracking promotion close:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        className="fixed left-1/2 transform -translate-x-1/2 top-[48px] z-10"
        onClick={handleBannerClick}
      >
        <div className="ribbon">
          <span className="text cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="animate-bounce">🎁</span>
              {!isSmallScreen && (
                <>
                  <span className="font-medium whitespace-nowrap">
                    {status === 'authenticated' && hasProLicense 
                      ? 'Share this Pro License offer with a friend!' 
                      : activePromotion.description}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseBanner();
                    }}
                    className="ml-2 text-black/80 hover:text-black transition-colors"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </>
              )}
            </span>
          </span>
          <style jsx>{`
            .ribbon {
              font-size: 16px;
              position: relative;
              display: inline-block;
              text-align: center;
              filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) 
                      drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))
                      drop-shadow(0 20px 13px rgb(0 0 0 / 0.08))
                      drop-shadow(0 40px 25px rgb(0 0 0 / 0.12));
            }
            .text {
              display: inline-block;
              padding: 0.5em 1em;
              min-width: ${isSmallScreen ? '3em' : '20em'};
              line-height: 1.2em;
              background: linear-gradient(to right, #FF69B4, #9370DB, #4169E1);
              position: relative;
              color: white;
              transition: all 0.2s ease;
            }
            .ribbon:hover .text {
              transform: translateY(-2px);
            }
            .ribbon:after, .ribbon:before,
            .text:before, .text:after {
              content: '';
              position: absolute;
              border-style: solid;
            }
            .ribbon:before {
              top: 0.3em;
              left: 0.2em;
              width: 100%;
              height: 100%;
              border: none;
              z-index: -2;
            }
            .text:before {
              bottom: 100%;
              left: 0;
              border-width: .5em .7em 0 0;
              border-color: transparent #FF69B4 transparent transparent;
            }
            .text:after {
              top: 100%;
              right: 0;
              border-width: .5em 2em 0 0;
              border-color: #4169E1 transparent transparent transparent;
            }
            .ribbon:after {
              top: 0.5em;
              right: -2em;
              border-width: 1.1em 1em 1.1em 3em;
              border-color: #9370DB transparent #9370DB #9370DB;
              z-index: -1;
            }
          `}</style>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <PromotionModal
            promotion={activePromotion}
            onClose={handleCloseModal}
            hasProLicense={status === 'authenticated' && hasProLicense}
          />
        )}
      </AnimatePresence>
    </>
  );
}
