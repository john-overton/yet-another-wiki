'use client';

import Header from './components/Header';
import Footer from './components/Footer';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import ReviewCarousel from './components/ReviewCarousel';
import { useEffect, useState } from 'react';

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="fixed top-0 left-0 right-0 h-12 p-1 flex justify-end overflow-visible bg-gray-100 dark:bg-gray-800 transition-colors duration-200 border-gray-header shadow-lg z-[2000]">
        <Header />
      </div>
      
      {/* Floating Navigation */}
      <nav className="fixed left-8 top-1/4 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="backdrop-blur-md bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-800/40 dark:to-gray-800/10 rounded-2xl shadow-xl p-3 space-y-2 border border-white/20 dark:border-gray-700/30">
          {['introduction', 'features', 'community', 'pricing'].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`flex items-center space-x-2 w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 ${
                activeSection === section
                  ? 'bg-white/30 dark:bg-gray-700/30 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/20'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                activeSection === section
                  ? 'bg-blue-600 dark:bg-blue-400'
                  : 'bg-gray-400/50 dark:bg-gray-500/50'
              }`} />
              <span className="capitalize">
                {section}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-grow">
        {/* Rest of the content remains unchanged */}
        {/* Hero Section */}
        <section id="introduction" className="relative py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh] bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
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
        <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Features That Actually Matter
            </h2>
            
            {/* Content Creation Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                  Rich Text Editing
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Powered by MDXEditor, our editor combines the power of markdown with the convenience of rich text editing. Write documentation your way, with features like:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    WYSIWYG editing interface
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Markdown support for power users
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Image drag-and-drop
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Code block syntax highlighting
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                  Intelligent Organization
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Keep your documentation organized with features designed for clarity and accessibility:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Nested pages for logical grouping
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Private pages for sensitive content
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Custom URLs for better navigation
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2 text-green-500"></i>
                    Automatic table of contents
                  </li>
                </ul>
              </div>
            </div>

            {/* Smart Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-3xl mb-4 text-blue-600 dark:text-blue-400">
                  <i className="ri-search-line"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Powerful Search
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Find anything in seconds with our advanced search capabilities. Full-text search that understands your content structure.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-3xl mb-4 text-blue-600 dark:text-blue-400">
                  <i className="ri-device-line"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Responsive Design
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access your documentation from any device. Our mobile-first approach ensures a great experience on phones, tablets, and desktops.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-3xl mb-4 text-blue-600 dark:text-blue-400">
                  <i className="ri-palette-line"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Customizable Theming
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Make it yours with light mode, dark mode, and custom theming options. Seamlessly integrate with your existing website&apos;s look and feel.
                </p>
              </div>
            </div>

            {/* Data Protection Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                  Data Protection
                </h3>
                <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <i className="ri-shield-check-line mt-1 mr-2 text-green-500"></i>
                    <span>
                      <strong className="block">Built-in Backup System</strong>
                      Import and export your documentation right from the app interface. No server access required.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-delete-bin-line mt-1 mr-2 text-green-500"></i>
                    <span>
                      <strong className="block">Trash Bin Recovery</strong>
                      Accidentally deleted something? No problem. Our trash bin keeps your deleted content safe until you&apos;re sure you want to remove it.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                  Team-Friendly
                </h3>
                <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <i className="ri-team-line mt-1 mr-2 text-green-500"></i>
                    <span>
                      <strong className="block">User Management</strong>
                      Add team members and manage permissions without complexity. Perfect for teams of any size.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-git-merge-line mt-1 mr-2 text-green-500"></i>
                    <span>
                      <strong className="block">Import Existing Docs</strong>
                      Bring your existing documentation from other platforms. Support for various formats including Markdown.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Community-Driven Development
              </h2>
              <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We believe in building features that matter to you. Visit our development features page to vote on upcoming features and report bugs. Your voice shapes our roadmap.
              </p>
              <Link 
                href="/dev-features" 
                className="inline-block px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200 transform hover:scale-105"
                aria-label="Visit Development Features"
              >
                Shape the Future
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Pricing That Makes Sense
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
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

              <div className="p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg border-2 border-blue-500 transform hover:scale-105 transition-transform duration-300">
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

        {/* Final CTA Section */}
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
              className="inline-block px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200 transform hover:scale-105"
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
