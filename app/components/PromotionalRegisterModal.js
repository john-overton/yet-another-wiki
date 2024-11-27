'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import PromotionalRegisterFormContent from './PromotionalRegisterFormContent';
import SecretQuestionsFormContent from './SecretQuestionsFormContent';

const LicenseAwardModal = ({ isOpen, onClose, licenseKey }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  
  if (!isOpen) return null;

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
            🎉 Congratulations! ✨
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
          <p className="text-gray-600 dark:text-gray-300">
            You&apos;ve been awarded a Pro License! 🌟
          </p>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-4 rounded-xl my-4 border border-white/20">
            <p className="text-sm font-mono text-gray-600 dark:text-gray-300 break-all">
              {licenseKey}
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You can view your license key at any time by clicking on your user avatar and selecting &quot;Account Settings&quot; 👤
          </p>
        </motion.div>

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
            Got it! ✨
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function PromotionalRegisterModal({ onClose, onShowLogin }) {
  const [activeForm, setActiveForm] = useState('register');
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const router = useRouter();

  const handleRegisterSuccess = (key) => {
    setLicenseKey(key);
    setShowLicenseModal(true);
  };

  const handleLicenseModalClose = () => {
    setShowLicenseModal(false);
    setActiveForm('security');
  };

  const handleSecurityQuestionsComplete = () => {
    onClose();
    router.push('/');
  };

  const content = (
    <div className="p-6">
      {activeForm === 'register' && (
        <PromotionalRegisterFormContent
          onBackToLogin={() => {
            onClose();
            onShowLogin();
          }}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {activeForm === 'security' && (
        <SecretQuestionsFormContent
          onComplete={handleSecurityQuestionsComplete}
        />
      )}
    </div>
  );

  return (
    <>
      <div className="w-full max-w-md relative">
        {content}
      </div>

      <AnimatePresence>
        {showLicenseModal && (
          <LicenseAwardModal
            isOpen={true}
            onClose={handleLicenseModalClose}
            licenseKey={licenseKey}
          />
        )}
      </AnimatePresence>
    </>
  );
}
