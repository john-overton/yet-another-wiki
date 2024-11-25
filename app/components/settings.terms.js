'use client';

import { useState, useEffect } from 'react';

export default function TermsSettings() {
  const [terms, setTerms] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const loadTermsAndPrivacy = async () => {
    try {
      const response = await fetch('/api/settings/terms');
      if (response.ok) {
        const data = await response.json();
        setTerms(data.termsAndConditions || '');
        setPrivacy(data.privacyPolicy || '');
      }
    } catch (error) {
      console.error('Error loading terms:', error);
    }
  };

  useEffect(() => {
    loadTermsAndPrivacy();
  }, []);

  const saveTerms = async (type, content) => {
    try {
      const response = await fetch('/api/settings/terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          content
        }),
      });

      if (response.ok) {
        setMessage(`${type === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'} updated successfully`);
        setTimeout(() => setMessage(''), 3000);
        loadTermsAndPrivacy();
      }
    } catch (error) {
      console.error('Error saving terms:', error);
      setMessage('Failed to save changes');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const TextModal = ({ isOpen, onClose, title, content, onSave }) => {
    const [text, setText] = useState(content);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-3/4 max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-grow p-4 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mb-4"
            style={{ minHeight: '300px' }}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(text);
                onClose();
              }}
              className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 border border-green-400">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <button
            onClick={() => setIsTermsModalOpen(true)}
            className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2"
          >
            <i className="ri-file-text-line"></i>
            Edit Terms of Service
          </button>
        </div>

        <div>
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2"
          >
            <i className="ri-shield-line"></i>
            Edit Privacy Policy
          </button>
        </div>
      </div>

      <TextModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title="Edit Terms and Conditions"
        content={terms}
        onSave={(content) => saveTerms('terms', content)}
      />

      <TextModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Edit Privacy Policy"
        content={privacy}
        onSave={(content) => saveTerms('privacy', content)}
      />
    </div>
  );
}
