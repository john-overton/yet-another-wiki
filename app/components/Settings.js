'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemingSettings from './settings.theming';
import LicensingSettings from './settings.licensing';
import UserManagementSettings from './settings.users';
import BackupSettings from './settings.backup';
import TermsSettings from './settings.terms';
import PromotionsSettings from './settings.promotions';
import pkg from '../../package.json';

const Settings = () => {
  const [expandedSections, setExpandedSections] = useState({
    theming: true,
    licensing: true,
    users: true,
    backup: true,
    env: true,
    terms: true,
    promotions: true
  });
  const [licenseType, setLicenseType] = useState(null);
  const [nextAuthUrl, setNextAuthUrl] = useState('');
  const [envMessage, setEnvMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadLicenseInfo = async () => {
      try {
        const response = await fetch('/api/settings/licensing');
        if (response.ok) {
          const settings = await response.json();
          setLicenseType(settings.licenseType);
        }
      } catch (error) {
        console.error('Error loading license info:', error);
      }
    };
    loadLicenseInfo();

    const loadEnvSettings = async () => {
      try {
        const response = await fetch('/api/settings/env');
        if (response.ok) {
          const data = await response.json();
          setNextAuthUrl(data.nextAuthUrl);
        }
      } catch (error) {
        console.error('Error loading env settings:', error);
      }
    };
    loadEnvSettings();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({ title, isExpanded, onToggle }) => (
    <div className="flex justify-between items-center bg-[#717171] dark:bg-[#1F2937] text-gray-300 px-4 py-2 rounded-t text-sm border-b border-gray-700">
      <span className="font-medium text-base">{title}</span>
      <button
        onClick={onToggle}
        className="hover:text-white transition-colors text-xs uppercase tracking-wider opacity-75 hover:opacity-100"
      >
        {isExpanded ? '▲ Hide Section' : '▼ Show Section'}
      </button>
    </div>
  );

  const handleNextAuthUrlUpdate = async () => {
    setIsUpdating(true);
    try {
      // First update the .env file
      const response = await fetch('/api/settings/env', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nextAuthUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update Server URL');
      }

      // Then reload the environment variables
      const reloadResponse = await fetch('/api/settings/env/reload', {
        method: 'POST',
      });

      if (!reloadResponse.ok) {
        const data = await reloadResponse.json();
        throw new Error(data.error || 'Failed to reload environment variables');
      }

      setEnvMessage('Server URL updated and reloaded successfully');
    } catch (error) {
      setEnvMessage(error.message);
    } finally {
      setIsUpdating(false);
      setTimeout(() => setEnvMessage(''), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold">Settings</h1>
          <span className="text-[10px] text-gray-600 dark:text-gray-400">v{pkg.version}</span>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2"
        >
          <i className="ri-arrow-left-line"></i>
          Back to Home
        </Link>
      </div>

      {/* Environment Settings Section */}
      <div className="mb-4">
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <SectionHeader 
            title="Environment Settings"
            isExpanded={expandedSections.env}
            onToggle={() => toggleSection('env')}
          />
          <div className={`transition-all duration-200 ${
            expandedSections.env ? 'opacity-100' : 'h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Server URL
                  </label>
                  <input
                    type="text"
                    value={nextAuthUrl}
                    onChange={(e) => setNextAuthUrl(e.target.value)}
                    placeholder="http://localhost:3000"
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    For development, use localhost:3000. For production, use your domain (e.g., https://example.com)
                  </p>
                </div>

                {envMessage && (
                  <div className={`p-3 rounded-lg ${
                    envMessage.includes('success') 
                      ? 'bg-green-100 text-green-700 border border-green-400' 
                      : 'bg-red-100 text-red-700 border border-red-400'
                  }`}>
                    {envMessage}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleNextAuthUrlUpdate}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <i className="ri-loader-4-line animate-spin"></i>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="ri-save-line"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Privacy Section */}
      <div className="mb-4">
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <SectionHeader 
            title="Terms & Privacy Policy"
            isExpanded={expandedSections.terms}
            onToggle={() => toggleSection('terms')}
          />
          <div className={`transition-all duration-200 ${
            expandedSections.terms ? 'opacity-100' : 'h-0 opacity-0 overflow-hidden'
          }`}>
            <TermsSettings />
          </div>
        </div>
      </div>

      {/* Promotions Section */}
      <div className="mb-4">
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <SectionHeader 
            title="Promotions"
            isExpanded={expandedSections.promotions}
            onToggle={() => toggleSection('promotions')}
          />
          <div className={`transition-all duration-200 ${
            expandedSections.promotions ? 'opacity-100' : 'h-0 opacity-0 overflow-hidden'
          }`}>
            <PromotionsSettings />
          </div>
        </div>
      </div>

      {/* User Management Section - Only visible for pro license */}
      {licenseType === 'pro' && (
        <div className="mb-4">
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <SectionHeader 
              title="User Management"
              isExpanded={expandedSections.users}
              onToggle={() => toggleSection('users')}
            />
            <div className={`transition-all duration-200 ${
              expandedSections.users ? 'opacity-100' : 'h-0 opacity-0 overflow-hidden'
            }`}>
              <UserManagementSettings />
            </div>
          </div>
        </div>
      )}

      {/* Backup Section */}
      <div className="mb-4">
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <SectionHeader 
            title="Backup & Import"
            isExpanded={expandedSections.backup}
            onToggle={() => toggleSection('backup')}
          />
          <div className={`transition-all duration-200 ${
            expandedSections.backup ? 'opacity-100' : 'h-0 opacity-0 overflow-hidden'
          }`}>
            <BackupSettings />
          </div>
        </div>
      </div>

      {/* Theming Section */}
      <div className="mb-4">
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <SectionHeader 
            title="Theming Settings"
            isExpanded={expandedSections.theming}
            onToggle={() => toggleSection('theming')}
          />
          <div className={`transition-all duration-200 ${
            expandedSections.theming ? 'opacity-100' : 'h-0 opacity-0 overflow-hidden'
          }`}>
            <ThemingSettings />
          </div>
        </div>
      </div>

      {/* Licensing Section */}
      <div className="mb-4">
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <SectionHeader 
            title="Licensing Settings"
            isExpanded={expandedSections.licensing}
            onToggle={() => toggleSection('licensing')}
          />
          <div className={`transition-all duration-200 ${
            expandedSections.licensing ? 'opacity-100' : 'h-0 opacity-0 overflow-hidden'
          }`}>
            <LicensingSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
