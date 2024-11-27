'use client';

import Header from './components/Header';
import Footer from './components/Footer';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import ReviewCarousel from './components/ReviewCarousel';

export default function Home() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="fixed top-0 left-0 right-0 h-12 p-1 flex justify-end overflow-visible bg-gray-100 dark:bg-gray-800 transition-colors duration-200 border-gray-header shadow-lg z-[2000]">
        <Header />
      </div>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh] bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Yes, Another Wiki Platform
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-gray-600 dark:text-gray-300">
              Because sometimes the world needs one more wiki solution 
              <span className="inline-block ml-2 animate-bounce">🚀</span>
            </p>
            <Link 
              href="/docs" 
              className="inline-block px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200"
              aria-label="Get Started with YetAnotherWiki"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              What Our Users Say
            </h2>
            <ReviewCarousel />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Why Choose <span className="text-blue-600 dark:text-blue-400">Yet Another</span> Wiki?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="text-3xl mb-4 text-blue-600 dark:text-blue-400">
                  <i className="ri-speed-line"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Built with modern tech for blazing performance. Because waiting is so Web 1.0.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="text-3xl mb-4 text-blue-600 dark:text-blue-400">
                  <i className="ri-palette-line"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Beautiful Simplicity</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Clean design meets intuitive interface. No PhD in rocket science required.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="text-3xl mb-4 text-blue-600 dark:text-blue-400">
                  <i className="ri-team-line"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Team-Friendly</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Collaboration tools that make teamwork actually work. Revolutionary, we know.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready to Start Your Wiki Journey?
            </h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
              Join the ranks of those who thought the world needed another wiki platform. 
              Spoiler alert: They were right.
            </p>
            <Link 
              href="/docs" 
              className="inline-block px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200"
              aria-label="Start Using YetAnotherWiki"
            >
              Start Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
