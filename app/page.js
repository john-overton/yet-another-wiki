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
            <div className="mb-4 text-gray-600 dark:text-gray-400 text-lg italic">
              &ldquo;Because the world needed another wiki platform... said no one ever.&rdquo;
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Documentation Made Human
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-gray-600 dark:text-gray-300">
              A wiki platform that doesn&apos;t require a computer science degree to maintain 
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
                  <i className="ri-edit-2-line"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Rich Content Editing</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Powered by MDXEditor with rich text editing, because markdown is great, but options are better.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="text-3xl mb-4 text-blue-600 dark:text-blue-400">
                  <i className="ri-layout-2-line"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Beautiful Simplicity</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Light mode, dark mode, custom theming, and a UI that actually makes sense.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="text-3xl mb-4 text-blue-600 dark:text-blue-400">
                  <i className="ri-team-line"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Team-Friendly</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Built for teams where not everyone speaks fluent Terminal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Smart Features That Matter
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-4">
                <div className="text-2xl mb-2 text-blue-600 dark:text-blue-400">
                  <i className="ri-file-list-3-line mr-2"></i>
                  Auto TOC
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Table of contents that builds itself
                </p>
              </div>

              <div className="p-4">
                <div className="text-2xl mb-2 text-blue-600 dark:text-blue-400">
                  <i className="ri-search-line mr-2"></i>
                  Smart Search
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Find anything in seconds
                </p>
              </div>

              <div className="p-4">
                <div className="text-2xl mb-2 text-blue-600 dark:text-blue-400">
                  <i className="ri-device-line mr-2"></i>
                  Mobile-Ready
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Because it&apos;s not 1999
                </p>
              </div>

              <div className="p-4">
                <div className="text-2xl mb-2 text-blue-600 dark:text-blue-400">
                  <i className="ri-archive-line mr-2"></i>
                  Easy Backups
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Import/export right in the app
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Pricing That Makes Sense
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Personal Use</h3>
                <div className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Free</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    All core features
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Perfect for hobby\solo projects
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Lifetime Updates
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <i className="ri-close-line mr-2 text-red-500"></i>
                    No Additional Users or User Management
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <i className="ri-close-line mr-2 text-red-500"></i>
                    Powered by YAW Always Enabled
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg border-2 border-blue-500">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Pro License</h3>
                <div className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">One-time fee</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Unlimited users
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    No subscriptions (How it&apos;s supposed to be)
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Remove YAW Labeling
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Lifetime updates
                  </li>
                </ul>
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
              Join the ranks of those who believe documentation should be easy to maintain.
              No PhD required.
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
