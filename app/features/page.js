'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function Features() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="fixed top-0 left-0 right-0 h-12 p-1 flex justify-end overflow-visible bg-gray-100 dark:bg-gray-800 transition-colors duration-200 border-gray-header shadow-lg z-[2000]">
        <Header />
      </div>
      
      <main className="flex-grow pt-12">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Features That Actually Matter
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Built for humans who believe documentation should be easy to maintain
            </p>
          </div>
        </section>

        {/* Content Creation Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">
              Content Creation Made Human
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
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
              <div>
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
          </div>
        </section>

        {/* Smart Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">
              Seriously Smart Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
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

              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
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

              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
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
          </div>
        </section>

        {/* Data Management Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">
              Because Life Happens
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
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
              <div>
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

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready to Transform Your Documentation?
            </h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
              Join teams who believe documentation should be a joy to maintain, not a chore.
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
      </main>

      <Footer />
    </div>
  );
}