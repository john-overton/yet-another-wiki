'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Sidebar from './Sidebar';
import TableOfContents from './TableOfContents';
import MDXEditor from './MDXEditor';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import MarkdownRenderer from './MarkdownRenderer';
import TrashBin from './TrashBin';

const MainAppLayout = () => {
  const [fileStructure, setFileStructure] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isTocVisible, setIsTocVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isTrashBinVisible, setIsTrashBinVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Update document title when selected file changes
  useEffect(() => {
    if (selectedFile?.title) {
      document.title = `${selectedFile.title} - Yet Another Wiki`;
    } else {
      document.title = 'Yet Another Wiki';
    }
  }, [selectedFile]);

  // Handle initial hash scroll
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash && fileContent) {
      const hash = window.location.hash.substring(1);
      const decodedHash = decodeURIComponent(hash);
      const element = document.getElementById(decodedHash);
      if (element) {
        void element.offsetHeight;
        element.scrollIntoView();
      }
    }
  }, [fileContent, searchParams]);

  const fetchFileStructure = useCallback(async () => {
    try {
      // Add cache-busting query parameter
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/file-structure?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFileStructure(data.pages);
    } catch (error) {
      console.error('Error fetching file structure:', error);
    }
  }, []);

  // Single useEffect for file structure refresh
  useEffect(() => {
    fetchFileStructure();

    // Set up production refresh interval
    if (process.env.NODE_ENV === 'production') {
      const interval = setInterval(fetchFileStructure, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchFileStructure, refreshTrigger]);

  const loadFileContent = useCallback(async (path) => {
    if (!path) return;
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/file-content?path=${encodeURIComponent(path)}&t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const content = await response.text();
      setFileContent(content);
    } catch (error) {
      console.error('Error loading file content:', error);
      setFileContent('Error loading file content');
    }
  }, []);

  const findFileBySlug = useCallback((items, slug) => {
    for (const item of items) {
      if (item.slug === slug) {
        return item;
      }
      if (item.children) {
        const found = findFileBySlug(item.children, slug);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }, []);

  useEffect(() => {
    const slug = params?.slug;
    if (slug && fileStructure.length > 0) {
      const file = findFileBySlug(fileStructure, slug);
      if (file && (file.isPublic || session)) {
        setSelectedFile(file);
        loadFileContent(file.path);
        setIsTrashBinVisible(false);
      } else if (!file || (!file.isPublic && !session)) {
        router.push('/');
      }
    } else if (fileStructure.length > 0) {
      const homeFile = fileStructure.find(f => f.slug === 'home');
      if (homeFile) {
        setSelectedFile(homeFile);
        loadFileContent(homeFile.path);
        setIsTrashBinVisible(false);
      }
    }
  }, [params, fileStructure, loadFileContent, session, router, findFileBySlug]);

  const handleFileSelect = useCallback((file) => {
    if (file.isPublic || session) {
      setSelectedFile(file);
      loadFileContent(file.path);
      router.push(`/${file.slug}`, undefined, { shallow: true });
      setIsTrashBinVisible(false);
    }
  }, [router, session, loadFileContent]);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleCreateNew = useCallback(async (parentPath, name, type) => {
    if (!session) return;
    try {
      const response = await fetch('/api/create-item', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ parentPath, name, type }),
      });
      if (response.ok) {
        triggerRefresh();
        await fetchFileStructure(); // Immediate refresh after creation
      } else {
        console.error('Failed to create new item');
      }
    } catch (error) {
      console.error('Error creating new item:', error);
    }
  }, [session, triggerRefresh, fetchFileStructure]);

  const handleDelete = useCallback(async (path, type) => {
    if (!session) return;
    try {
      const response = await fetch('/api/delete-item', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ path, type }),
      });
      if (response.ok) {
        triggerRefresh();
        await fetchFileStructure(); // Immediate refresh after deletion
        if (selectedFile && selectedFile.path === path) {
          router.push('/');
        }
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [selectedFile, router, session, triggerRefresh, fetchFileStructure]);

  const handleRename = useCallback(async (oldPath, newName, type) => {
    if (!session) return;
    try {
      const response = await fetch('/api/rename-item', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ oldPath, newName, type }),
      });
      const data = await response.json();
      if (response.ok) {
        triggerRefresh();
        await fetchFileStructure(); // Immediate refresh after rename
        if (selectedFile && selectedFile.path === oldPath) {
          router.push(`/${data.newSlug}`, undefined, { shallow: true });
        }
      } else {
        console.error('Failed to rename item:', data.message);
        alert(`Failed to rename item: ${data.message}`);
      }
    } catch (error) {
      console.error('Error renaming item:', error);
      alert(`Error renaming item: ${error.message}`);
    }
  }, [selectedFile, router, session, triggerRefresh, fetchFileStructure]);

  const handleSave = useCallback(async (updatedFile) => {
    if (!session) return;
    try {
      const response = await fetch('/api/update-file', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(updatedFile),
      });
      if (response.ok) {
        setSelectedFile(updatedFile);
        setIsEditing(false);
        triggerRefresh();
        await fetchFileStructure(); // Immediate refresh after save
        router.push(`/${updatedFile.slug}`, undefined, { shallow: true });
      } else {
        console.error('Failed to update file');
      }
    } catch (error) {
      console.error('Error updating file:', error);
    }
  }, [router, session, triggerRefresh, fetchFileStructure]);

  const handleSortOrderChange = useCallback(async (path, newSortOrder) => {
    if (!session) return;
    try {
      const response = await fetch('/api/update-sort-order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ path, newSortOrder }),
      });
      if (response.ok) {
        triggerRefresh();
        await fetchFileStructure(); // Immediate refresh after sort order change
      } else {
        console.error('Failed to update sort order');
      }
    } catch (error) {
      console.error('Error updating sort order:', error);
    }
  }, [session, triggerRefresh, fetchFileStructure]);

  const toggleToc = useCallback(() => {
    setIsTocVisible((prev) => !prev);
  }, []);

  const toggleEdit = useCallback(() => {
    if (session) {
      setIsEditing((prev) => !prev);
      setIsTocVisible(false);
    }
  }, [session]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev);
  }, []);

  const handleTrashBinClick = useCallback(() => {
    setIsTrashBinVisible(true);
    setSelectedFile(null);
    setFileContent('');
    setIsEditing(false);
    setIsTocVisible(false);
  }, []);

  const memoizedSidebar = useMemo(() => (
    <Sidebar
      fileStructure={fileStructure}
      onSelect={handleFileSelect}
      onCreateNew={handleCreateNew}
      onDelete={handleDelete}
      onRename={handleRename}
      isAuthenticated={!!session}
      refreshFileStructure={fetchFileStructure}
      onTrashBinClick={handleTrashBinClick}
      onSortOrderChange={handleSortOrderChange}
    />
  ), [fileStructure, handleFileSelect, handleCreateNew, handleDelete, handleRename, session, fetchFileStructure, handleTrashBinClick, handleSortOrderChange]);

  const renderEditor = () => {
    if (!selectedFile || !isEditing) return null;
    return <MDXEditor file={selectedFile} onSave={handleSave} onCancel={handleCancel} />;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden relative">
        <div className={`transition-all duration-300 ease-in-out ${isSidebarVisible ? 'w-64' : 'w-0'} flex-shrink-0 z-[999] overflow-hidden`}>
          {memoizedSidebar}
        </div>
        <button
          onClick={toggleSidebar}
          className="fixed z-[998] top-20 transition-all duration-300"
          style={{
            transform: 'translateY(-55%)',
            left: isSidebarVisible ? '15.8rem' : '0'
          }}
        >
          <i 
            className={`ri-${isSidebarVisible ? 'arrow-left-line' : 'contract-right-line'} bg-white pt-2 pb-2 shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-600 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 pr-1 rounded-r-xl`}
            style={{ fontSize: '1rem', display: 'block' }}
          ></i>
        </button>
        <main className="z-[1] flex-1 bg-background-light overflow-y-auto">
          <div className="mx-auto px-6 py-8">
            {isTrashBinVisible ? (
              <TrashBin />
            ) : (
              selectedFile && !isEditing ? (
                <MarkdownRenderer content={fileContent} />
              ) : (
                renderEditor() || <div>Select a file from the sidebar</div>
              )
            )}
          </div>
          {!isEditing && !isTrashBinVisible && (
            <>
              <div className="fixed z-[2010] border border-gray-200 dark:border-gray-600 top-12 right-5 bg-[#F3F4F6] dark:bg-gray-800 shadow-lg rounded-b-xl px-4 py-2 flex gap-4">
                {session && (
                  <button
                    onClick={toggleEdit}
                    className="transition-colors duration-200"
                  >
                    <i 
                      className="ri-edit-2-line text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                      style={{ fontSize: '1.25rem' }}
                    ></i>
                  </button>
                )}
                <button
                  onClick={toggleToc}
                  className="transition-colors duration-200"
                >
                  <i 
                    className={`ri-list-unordered p-1 ${isTocVisible ? 'border border-gray-200 dark:border-gray-600 bg-gray-300 dark:bg-gray-700' : ''} text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300`}
                    style={{ fontSize: '1.25rem' }}
                  ></i>
                </button>
              </div>
              <div className={`fixed z-[998] right-4 top-28 transition-opacity duration-300 ${isTocVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <TableOfContents source={fileContent} isVisible={isTocVisible} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default React.memo(MainAppLayout);
