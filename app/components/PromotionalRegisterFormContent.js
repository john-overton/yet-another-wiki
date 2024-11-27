'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import TermsModal from './TermsModal';
import { motion } from 'framer-motion';

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
          const now = new Date();
          const active = promotions.find(promo => {
            const isActive = 
              new Date(promo.startDate) <= now && 
              new Date(promo.endDate) >= now &&
              promo.type === 'giveaway' &&
              (promo.remainingGiveaways || 0) > 0;
            return isActive;
          });

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
        await updatePromotionStats();
      }

      // Generate license for the new user
      let licenseData = null;
      try {
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
      } else if (activePromotion?.type === 'giveaway' && licenseData?.licenseKey) {
        // Pass the license key to parent component to show the modal
        onRegisterSuccess(licenseData.licenseKey);
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
      <div>
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 to-blue-600 dark:from-pink-400 dark:to-blue-400 bg-clip-text text-transparent"
        >
          🎉 Claim Your Pro License! ✨
        </motion.h2>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 rounded-xl bg-red-100/90 text-red-700 border border-red-200 backdrop-blur-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all duration-200"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
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
                className={`w-full border rounded-xl px-4 py-3 bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all duration-200 ${
                  emailError ? 'border-red-500' : ''
                }`}
                required
              />
              {isCheckingEmail && (
                <div className="absolute right-4 top-3">
                  <i className="ri-loader-4-line animate-spin text-gray-600 dark:text-gray-300"></i>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all duration-200"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all duration-200"
              required
            />
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center"
          >
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              By registering, you agree to YetAnotherWiki.com&apos;s{' '}
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
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading || !isEmailValid || isCheckingEmail}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 ${
              !isEmailValid || isCheckingEmail || loading
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                Creating Your Account...
              </>
            ) : (
              <>
                <i className="ri-gift-line"></i>
                Claim Your Pro License
              </>
            )}
          </motion.button>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-center text-gray-600 dark:text-gray-400"
          >
            <button
              type="button"
              onClick={() => {
                setError('');
                onBackToLogin();
              }}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Already have an account? Log in
            </button>
          </motion.div>
        </form>
      </div>

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
    </>
  );
}
