'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function UserCard({ user }) {
  const [avatarError, setAvatarError] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    const handleAvatarUpdate = () => {
      setTimestamp(Date.now());
      setAvatarError(false);
    };

    window.addEventListener('user-avatar-updated', handleAvatarUpdate);
    return () => window.removeEventListener('user-avatar-updated', handleAvatarUpdate);
  }, []);

  useEffect(() => {
    const fetchLicenses = async () => {
      if (!user?.email) return;
      
      try {
        const response = await fetch(`/api/license?email=${encodeURIComponent(user.email)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch licenses');
        }
        const data = await response.json();
        setLicenses(data.licenses || []);
      } catch (err) {
        setError('Failed to load licenses');
        console.error('Error fetching licenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, [user?.email]);

  const handleCopyLicense = async (licenseKey) => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopiedKey(licenseKey);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy license key:', err);
    }
  };

  if (!user) return null;

  const getAvatarSrc = () => {
    if (!user.avatar) return null;
    if (user.avatar.startsWith('data:')) return user.avatar;
    
    // Convert filename to dynamic API path
    const filename = user.avatar.includes('/') 
      ? user.avatar.split('/').pop() 
      : user.avatar;
    
    return `/api/uploads/user-avatars/${filename}?t=${timestamp}`;
  };

  const avatarSrc = getAvatarSrc();

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {avatarSrc && !avatarError ? (
            <div className="relative h-[50px] w-[50px] rounded-full overflow-hidden">
              <Image
                src={avatarSrc}
                alt={user.name}
                className="object-cover"
                fill
                sizes="50px"
                onError={() => setAvatarError(true)}
                unoptimized={true}
                priority
                key={timestamp}
              />
            </div>
          ) : (
            <div className="h-[50px] w-[50px] rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <i className="ri-user-line text-xl text-gray-500 dark:text-gray-400"></i>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
        </div>
      </div>

      {/* License Section */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Licenses</h3>
        {loading ? (
          <div className="text-gray-600 dark:text-gray-400">Loading licenses...</div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400">{error}</div>
        ) : licenses.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400">No licenses found</div>
        ) : (
          <div className="space-y-2">
            {licenses.map((license, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded-lg"
              >
                <div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    license.type === 'pro' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  } mr-2`}>
                    {license.type.toUpperCase()}
                  </span>
                  <span className="font-mono text-sm text-gray-600 dark:text-gray-300">
                    {license.key}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyLicense(license.key)}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Copy license key"
                >
                  {copiedKey === license.key ? (
                    <i className="ri-check-line"></i>
                  ) : (
                    <i className="ri-file-copy-line"></i>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
