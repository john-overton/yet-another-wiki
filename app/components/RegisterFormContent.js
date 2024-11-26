'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TermsModal from './TermsModal';
import ReactConfetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

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
            You've been awarded a Pro License! 🌟
          </p>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-4 rounded-xl my-4 border border-white/20">
            <p className="text-sm font-mono text-gray-600 dark:text-gray-300 break-all">
              {licenseKey}
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You can view your license key at any time by clicking on your user avatar and selecting "Account Settings" 👤
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

export default function RegisterFormContent({ onBackToLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsContent, setTermsContent] = useState('');
  const [privacyContent, setPrivacyContent] = useState('');
  const [activePromotion, setActivePromotion] = useState(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadTermsAndPrivacy = async () => {
      try {
        const response = await fetch('/api/settings/terms');
        if (response.ok) {
          const data = await response.json();
          setTermsContent(data.termsAndConditions || '');
          setPrivacyContent(data.privacyPolicy || '');
        }
      } catch (error) {
        console.error('Error loading terms:', error);
      }
    };
    
    const checkActivePromotion = async () => {
      try {
        const response = await fetch('/api/settings/promotions');
        if (response.ok) {
          const promotions = await response.json();
          console.log('Found promotions:', promotions); // Debug log
          
          const now = new Date();
          const active = promotions.find(promo => {
            const isActive = 
              new Date(promo.startDate) <= now && 
              new Date(promo.endDate) >= now &&
              promo.type === 'giveaway' &&
              (promo.remainingGiveaways || 0) > 0;
            
            console.log('Checking promotion:', { // Debug log
              id: promo.id,
              type: promo.type,
              startDate: promo.startDate,
              endDate: promo.endDate,
              remainingGiveaways: promo.remainingGiveaways,
              isActive
            });
            
            return isActive;
          });

          console.log('Active promotion:', active); // Debug log
          if (active) {
            setActivePromotion(active);
          }
        }
      } catch (error) {
        console.error('Error checking active promotions:', error);
      }
    };

    loadTermsAndPrivacy();
    checkActivePromotion();
  }, []);

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const checkEmailExists = async (email) => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      setIsEmailValid(false);
      return;
    }

    setIsCheckingEmail(true);
    try {
      const response = await fetch('/api/users/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setEmailError('This email is already registered');
          setIsEmailValid(false);
        } else {
          setEmailError('');
          setIsEmailValid(true);
        }
      } else {
        setEmailError('Failed to verify email');
        setIsEmailValid(false);
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailError('Failed to verify email');
      setIsEmailValid(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setFormData(prev => ({ ...prev, email: newEmail }));
    
    if (!newEmail) {
      setEmailError('Email is required');
      setIsEmailValid(false);
      return;
    }

    if (!validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
      setIsEmailValid(false);
      return;
    }

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      checkEmailExists(newEmail);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const updatePromotionStats = async () => {
    if (!activePromotion) return;

    try {
      console.log('Updating promotion stats for:', activePromotion.id); // Debug log
      await fetch('/api/settings/promotions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activePromotion.id,
          action: 'register'
        }),
      });
    } catch (error) {
      console.error('Error updating promotion stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setError('You must accept the Terms and Privacy Policy to register');
      return;
    }
    
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // First create the user account
      const createResponse = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          auth_type: 'local',
          role: 'User',
          is_active: true,
          voting_rights: false,
          avatar: null
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Failed to create account');
      }

      // Update promotion stats if there's an active promotion
      if (activePromotion) {
        console.log('Active promotion during registration:', activePromotion); // Debug log
        await updatePromotionStats();
      }

      // Generate license for the new user
      let licenseData = null;
      try {
        console.log('Requesting license generation...'); // Debug log
        const licenseResponse = await fetch('/api/license', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email
          }),
        });

        if (licenseResponse.ok) {
          licenseData = await licenseResponse.json();
          console.log('License response:', licenseData); // Debug log
          if (licenseData.licenseKey) { // Changed from .key to .licenseKey
            console.log('License key received:', licenseData.licenseKey); // Debug log
            setLicenseKey(licenseData.licenseKey); // Changed from .key to .licenseKey
          } else {
            console.log('No license key in response:', licenseData); // Debug log
          }
        } else {
          console.error('License response not OK:', await licenseResponse.text());
        }
      } catch (error) {
        console.error('Error generating license:', error);
      }

      // After successful registration, sign in the user
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setError('Account created but failed to log in. Please try logging in manually.');
        onBackToLogin();
      } else {
        // If this was a giveaway promotion and we have a license key, show the modal
        console.log('Checking conditions for license modal:', { // Debug log
          hasActivePromotion: !!activePromotion,
          promotionType: activePromotion?.type,
          hasLicenseKey: !!licenseData?.licenseKey, // Changed from .key to .licenseKey
          licenseKey: licenseData?.licenseKey // Changed from .key to .licenseKey
        });

        if (activePromotion?.type === 'giveaway' && licenseData?.licenseKey) { // Changed from .key to .licenseKey
          console.log('Showing license modal with key:', licenseData.licenseKey); // Debug log
          setShowLicenseModal(true);
        } else {
          console.log('Not showing license modal because:', { // Debug log
            noActivePromotion: !activePromotion,
            notGiveaway: activePromotion?.type !== 'giveaway',
            noLicenseKey: !licenseData?.licenseKey // Changed from .key to .licenseKey
          });
          onRegisterSuccess();
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Register</h2>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          {emailError && (
            <div className="text-sm text-red-500 dark:text-red-400 mb-1">
              {emailError}
            </div>
          )}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleEmailChange}
              className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 ${
                emailError ? 'border-red-500' : ''
              }`}
              required
            />
            {isCheckingEmail && (
              <div className="absolute right-3 top-2">
                <i className="ri-loader-4-line animate-spin text-gray-600 dark:text-gray-300"></i>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            By registering, you agree to YetAnotherWiki.com's{' '}
            <button
              type="button"
              onClick={() => setTermsModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button
              type="button"
              onClick={() => setPrivacyModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Privacy Policy
            </button>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !isEmailValid || isCheckingEmail}
          className={`w-full px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black rounded-lg flex items-center justify-center gap-2 ${
            !isEmailValid || isCheckingEmail || loading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {loading ? (
            <>
              <i className="ri-loader-4-line animate-spin"></i>
              Creating Account...
            </>
          ) : (
            <>
              <i className="ri-user-add-line"></i>
              Create Account
            </>
          )}
        </button>

        <div className="text-sm text-center text-gray-600 dark:text-gray-400">
          <button
            type="button"
            onClick={() => {
              setError('');
              onBackToLogin();
            }}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Back to Login
          </button>
        </div>
      </form>

      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        title="Terms of Service"
        content={termsContent}
      />

      <TermsModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="Privacy Policy"
        content={privacyContent}
      />

      <AnimatePresence>
        <LicenseAwardModal
          isOpen={showLicenseModal}
          onClose={() => {
            setShowLicenseModal(false);
            onRegisterSuccess();
          }}
          licenseKey={licenseKey}
        />
      </AnimatePresence>
    </>
  );
}
