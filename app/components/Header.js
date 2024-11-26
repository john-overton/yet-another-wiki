'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import UserButton from './UserButton';
import SearchModal from './SearchModal';
import Logo from './Logo';
import LoginModal from './LoginModal';
import PromotionBanner from './PromotionBanner';

const Header = ({ onFileSelect, isMobile, isSidebarVisible, onToggleSidebar, isEditing }) => {
  const [mounted, setMounted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [shouldCollapseLinks, setShouldCollapseLinks] = useState(false);
  const [headerLogo, setHeaderLogo] = useState({ lightLogo: null, darkLogo: null });
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();
  const menuRef = useRef(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings/theming');
        if (response.ok) {
          const settings = await response.json();
          setLinks(settings.links || []);
          setHeaderLogo(settings.headerLogo || { lightLogo: null, darkLogo: null });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkWidth = () => {
      const screenWidth = window.innerWidth;
      setShouldCollapseLinks(screenWidth < 1000);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  const MenuButton = ({ onClick, isActive }) => (
    <button
      onClick={onClick}
      className="p-2 rounded-md hover:text-gray-600 dark:hover:text-gray-300"
    >
      <i 
        className={`ri-menu-5-line text-xl ${isActive ? 'p-1 border border-gray-200 dark:border-gray-600 bg-gray-300 dark:bg-gray-700' : ''}`}
        style={{ fontSize: '20px' }}
      ></i>
    </button>
  );

  const renderLink = (link, isCollapsed = false) => (
    <a
      key={link.id}
      href={link.url}
      title={link.hoverText}
      target={link.newTab ? "_blank" : "_self"}
      rel={link.newTab ? "noopener noreferrer" : ""}
      className={isCollapsed 
        ? "block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        : "whitespace-nowrap p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}
      onClick={() => setShowMobileMenu(false)}
    >
      {link.text}
    </a>
  );

  const getCurrentLogo = () => {
    if (!headerLogo) return null;
    if (resolvedTheme === 'dark' && headerLogo.darkLogo) {
      return headerLogo.darkLogo;
    }
    if (resolvedTheme === 'light' && headerLogo.lightLogo) {
      return headerLogo.lightLogo;
    }
    // Fallback to the appropriate logo if one mode is missing
    return headerLogo.lightLogo || headerLogo.darkLogo;
  };

  return (
    <>
      <div className="flex items-center justify-between w-full p-1">
        <div className="flex justify-content-start items-center">
          {isMobile && !isEditing && (
            <button
              onClick={onToggleSidebar}
              aria-label="Toggle Sidebar"
              type="button"
              className="mr-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i 
                className={`ri-menu-2-line text-xl ${isSidebarVisible ? 'p-1 border border-gray-200 dark:border-gray-600 bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300' : ''}`}
                style={{ fontSize: '20px' }}
              ></i>
            </button>
          )}
          {getCurrentLogo() ? (
            <Link href="/">
              <Image 
                src={getCurrentLogo()} 
                alt="Site Logo"
                width={120}
                height={40}
                className="h-[40px] object-contain m-2"
                key={getCurrentLogo()} // Add key prop to force re-render
                priority // Add priority to load image immediately
                unoptimized // Bypass image optimization to prevent caching
              />
            </Link>
          ) : (
            <Logo />
          )}
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 ml-4">
          <div className="flex-shrink-0">
            <PromotionBanner />
          </div>

          {/* Links Container */}
          {links.length > 0 && (
            <div className="relative flex items-center" ref={menuRef}>
              {shouldCollapseLinks ? (
                <div className="relative">
                  <MenuButton 
                    onClick={() => setShowMobileMenu(!showMobileMenu)} 
                    isActive={showMobileMenu}
                  />
                  {showMobileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                      <div className="border-b border-gray-200 dark:border-gray-600">
                        {links.map(link => renderLink(link, true))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  {links.map(link => renderLink(link, false))}
                </div>
              )}
            </div>
          )}

          {/* Search and User Controls */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 mr-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center"
            >
              <i className="ri-search-line text-xl"></i>
              <span className="ml-1 text-xs text-gray-500">ctrl-k</span>
            </button>
            {session ? (
              <UserButton user={session.user} />
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                aria-label="Login"
                type="button"
                className="p-2 mr-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Login
              </button>
            )}
            <button
              aria-label="Toggle Dark Mode"
              type="button"
              className="p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              onClick={toggleTheme}
            >
              <i className={`${resolvedTheme === 'light' ? 'ri-contrast-2-line' : 'ri-sun-fill'} text-xl`} style={{ fontSize: '20px' }}></i>
            </button>
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default Header;
