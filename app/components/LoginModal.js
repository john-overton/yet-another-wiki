'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import RegisterFormContent from './RegisterFormContent';
import PasswordResetFormContent from './PasswordResetFormContent';
import SecretQuestionsFormContent from './SecretQuestionsFormContent';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';

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
            You can view your license key at any time in your Account Settings 👤
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

export default function LoginModal({ isOpen, onClose, isStandalone = false, providers = null, fromPromotion = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeForm, setActiveForm] = useState('login');
  const [licenseType, setLicenseType] = useState(null);
  const [preventUserRegistration, setPreventUserRegistration] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [hasProLicense, setHasProLicense] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [licenseResponse, generalSettingsResponse] = await Promise.all([
          fetch('/api/settings/licensing'),
          fetch('/api/settings')
        ]);
        
        if (licenseResponse.ok) {
          const licenseData = await licenseResponse.json();
          setLicenseType(licenseData.licenseType);
        }
        
        if (generalSettingsResponse.ok) {
          const generalData = await generalSettingsResponse.json();
          setPreventUserRegistration(generalData.preventUserRegistration || false);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    if (isOpen || isStandalone) {
      fetchSettings();
    }
  }, [isOpen, isStandalone]);

  useEffect(() => {
    if (isOpen || isStandalone) {
      setEmail('');
      setPassword('');
      setError('');
      setSuccessMessage('');
      setLoading(false);
      setActiveForm('login');
      setShowLicenseModal(false);
      setLicenseKey('');
    }
  }, [isOpen, isStandalone]);

  if (!isOpen && !isStandalone) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        const hasNoSecurityQuestions = !userData.secret_question_1_id && 
                                     !userData.secret_question_2_id && 
                                     !userData.secret_question_3_id;

        // Check if user has a pro license
        const licenseResponse = await fetch(`https://lic.yetanotherwiki.com/api/license/lookup/${encodeURIComponent(email)}`);
        const licenseData = await licenseResponse.json();
        const hasExistingProLicense = licenseData?.license_type === 'pro' && licenseData?.active;
        setHasProLicense(hasExistingProLicense);

        // If this login is from a promotion and user doesn't have a pro license
        if (fromPromotion) {
          if (hasExistingProLicense) {
            setError('You already have an active Pro License');
            setLoading(false);
            return;
          }

          try {
            const promotionResponse = await fetch('/api/settings/promotions');
            const promotions = await promotionResponse.json();
            const activeGiveaway = promotions.find(p => 
              p.type === 'giveaway' && 
              new Date(p.startDate) <= new Date() && 
              new Date(p.endDate) >= new Date() &&
              p.remainingGiveaways > 0
            );

            if (activeGiveaway) {
              // Generate license for the user
              const licenseResponse = await fetch('/api/license', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
              });

              if (licenseResponse.ok) {
                const licenseData = await licenseResponse.json();
                if (licenseData.licenseKey) {
                  setLicenseKey(licenseData.licenseKey);

                  // Update promotion stats
                  await fetch('/api/settings/promotions', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      id: activeGiveaway.id,
                      action: 'register'
                    }),
                  });

                  setShowLicenseModal(true);
                }
              }
            }
          } catch (error) {
            console.error('Error handling promotion:', error);
          }
        }

        if (hasNoSecurityQuestions) {
          setActiveForm('security');
        } else {
          await fetch('/api/auth/update-last-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!showLicenseModal) {
            if (!isStandalone && onClose) onClose();
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleSecurityQuestionsComplete = () => {
    if (!isStandalone && onClose) onClose();
    router.push('/');
  };

  const handleRegisterSuccess = (registeredEmail) => {
    setEmail(registeredEmail);
    setPassword('');
    setActiveForm('login');
  };

  const handleResetSuccess = (resetEmail) => {
    setEmail(resetEmail);
    setPassword('');
    setSuccessMessage('Password was successfully changed. Please log in with your new password.');
    setActiveForm('login');
  };

  const content = (
    <div className="p-6">
      {activeForm === 'login' && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-400">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 border border-green-400">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line"></i>
                  Log In
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            {licenseType === 'pro' && !preventUserRegistration && (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => {
                    setError('');
                    setSuccessMessage('');
                    setActiveForm('register');
                  }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Register here
                </button>
              </p>
            )}
            <p className={licenseType === 'pro' && !preventUserRegistration ? 'mt-2' : ''}>
              Forgot your password?{' '}
              <button
                onClick={() => {
                  setError('');
                  setSuccessMessage('');
                  setActiveForm('reset');
                }}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Reset password
              </button>
            </p>
          </div>
        </>
      )}

      {activeForm === 'register' && licenseType === 'pro' && !preventUserRegistration && (
        <RegisterFormContent
          onBackToLogin={() => setActiveForm('login')}
          onRegisterSuccess={() => setActiveForm('security')}
        />
      )}

      {activeForm === 'reset' && (
        <PasswordResetFormContent
          onBackToLogin={() => setActiveForm('login')}
          onResetSuccess={handleResetSuccess}
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
      {isStandalone ? (
        <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {content}
        </div>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div 
            className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl" 
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
            {content}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showLicenseModal && (
          <LicenseAwardModal
            isOpen={true}
            onClose={() => {
              setShowLicenseModal(false);
              if (!isStandalone && onClose) onClose();
              router.push('/');
            }}
            licenseKey={licenseKey}
          />
        )}
      </AnimatePresence>
    </>
  );
}
