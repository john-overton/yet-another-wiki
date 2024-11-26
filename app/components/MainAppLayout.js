'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Open_Sans } from 'next/font/google';
import Sidebar from './Sidebar';
import TableOfContents from './TableOfContents';
import MDXEditor from './MDXEditor';
import SavePromptModal from './SavePromptModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import ImportModal from './ImportModal';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import MarkdownRenderer from './MarkdownRenderer';
import TrashBin from './TrashBin';
import Footer from './Footer';
import Header from './Header';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

const MainAppLayout = () => {
  const [fileStructure, setFileStructure] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isTocVisible, setIsTocVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTrashBinVisible, setIsTrashBinVisible] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentEditorContent, setCurrentEditorContent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteModalSource, setDeleteModalSource] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false); // Add this line

  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const userRole = session?.user?.role;
  const canModifyContent = userRole !== 'User';

  // Handle window resize and mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 600;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      const response = await fetch('/api/file-structure', {
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

  useEffect(() => {
    fetchFileStructure();
  }, [fetchFileStructure]);

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

  const handleNavigation = useCallback((destination) => {
    if (isEditing && hasUnsavedChanges) {
      setIsPromptOpen(true);
      setPendingNavigation(destination);
      return false;
    }
    setIsEditing(false);
    return true;
  }, [isEditing, hasUnsavedChanges]);

  const handleFileSelect = useCallback((file) => {
    if (file.isPublic || session) {
      const isSameFile = selectedFile && selectedFile.path === file.path;
      if (handleNavigation(`/${file.slug}`)) {
        setSelectedFile(file);
        loadFileContent(file.path);
        router.push(`/${file.slug}`, undefined, { shallow: true });
        setIsTrashBinVisible(false);
        if (isSameFile) {
          setIsEditing(false);
        }
        if (isMobile) {
          setIsSidebarVisible(false);
        }
      }
    }
  }, [router, session, loadFileContent, handleNavigation, selectedFile, isMobile]);

  const handleCreateNew = useCallback(async (parentPath, name, type) => {
    if (!session || !canModifyContent) return;
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
        await fetchFileStructure();
      } else {
        console.error('Failed to create new item');
      }
    } catch (error) {
      console.error('Error creating new item:', error);
    }
  }, [session, fetchFileStructure, canModifyContent]);

  const handleDelete = useCallback(async (id, source) => {
    if (!session || !canModifyContent) return;
    try {
      const response = await fetch('/api/delete-item', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: id,
          permanent: source === 'trashbin'
        }),
      });
      if (response.ok) {
        await fetchFileStructure();
        if (selectedFile && selectedFile.id === id && !isTrashBinVisible) {
          router.push('/');
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to delete item:', errorData.error);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [selectedFile, router, session, fetchFileStructure, isTrashBinVisible, canModifyContent]);

  const handleDeleteClick = useCallback((id, title, hasChildren, source) => {
    if (!canModifyContent) return;
    setItemToDelete({ id, title, hasChildren });
    setDeleteModalSource(source);
    setIsDeleteModalOpen(true);
  }, [canModifyContent]);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    await handleDelete(itemToDelete.id, deleteModalSource);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
    setDeleteModalSource(null);
  }, [itemToDelete, deleteModalSource, handleDelete]);

  const handleRename = useCallback(async (oldPath, newName, type) => {
    if (!session || !canModifyContent) return;
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
        await fetchFileStructure();
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
  }, [selectedFile, router, session, fetchFileStructure, canModifyContent]);

  const handleSave = useCallback(async (updatedFile) => {
    if (!session || !canModifyContent) return;
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
        setHasUnsavedChanges(false);
        await fetchFileStructure();
        if (pendingNavigation) {
          router.push(pendingNavigation);
          setPendingNavigation(null);
        } else {
          router.push(`/${updatedFile.slug}`, undefined, { shallow: true });
        }
      } else {
        console.error('Failed to update file');
      }
    } catch (error) {
      console.error('Error updating file:', error);
    }
  }, [router, session, fetchFileStructure, pendingNavigation, canModifyContent]);

  const handleSaveAndNavigate = useCallback(async () => {
    if (selectedFile && currentEditorContent && canModifyContent) {
      try {
        const updatedFile = {
          ...selectedFile,
          ...currentEditorContent,
          lastModified: new Date().toISOString(),
          version: 1
        };

        await handleSave(updatedFile);
        setIsPromptOpen(false);
      } catch (error) {
        console.error('Error saving file:', error);
      }
    }
  }, [selectedFile, currentEditorContent, handleSave, canModifyContent]);

  const handleDiscardAndNavigate = useCallback(() => {
    setIsPromptOpen(false);
    setHasUnsavedChanges(false);
    setIsEditing(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, router]);

  const handleSortOrderChange = useCallback(async (path, newSortOrder) => {
    if (!session || !canModifyContent) return;
    try {
      await fetchFileStructure();
    } catch (error) {
      console.error('Error updating sort order:', error);
    }
  }, [session, fetchFileStructure, canModifyContent]);

  const toggleToc = useCallback(() => {
    setIsTocVisible((prev) => !prev);
  }, []);

  const toggleEdit = useCallback(() => {
    if (session && canModifyContent) {
      setIsEditing((prev) => !prev);
      setIsTocVisible(false);
    }
  }, [session, canModifyContent]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setHasUnsavedChanges(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev);
  }, []);

  const handleTrashBinClick = useCallback(() => {
    if (!canModifyContent) return;
    if (handleNavigation('/trash')) {
      setIsTrashBinVisible(true);
      setSelectedFile(null);
      setFileContent('');
      setIsEditing(false);
      setIsTocVisible(false);
    }
  }, [handleNavigation, canModifyContent]);

  const handleChangesPending = useCallback((isPending, editorState = null) => {
    setHasUnsavedChanges(isPending);
    if (editorState) {
      setCurrentEditorContent(editorState);
    }
  }, []);

  const memoizedSidebar = useMemo(() => (
    <Sidebar
      fileStructure={fileStructure}
      onSelect={handleFileSelect}
      onCreateNew={handleCreateNew}
      onDelete={handleDeleteClick}
      onRename={handleRename}
      isAuthenticated={!!session}
      refreshFileStructure={fetchFileStructure}
      onTrashBinClick={handleTrashBinClick}
      onSortOrderChange={handleSortOrderChange}
      session={session}
      onImportClick={() => setIsImportModalOpen(true)}
      currentPage={selectedFile}
    />
  ), [fileStructure, handleFileSelect, handleCreateNew, handleDeleteClick, handleRename, session, fetchFileStructure, handleTrashBinClick, handleSortOrderChange, selectedFile]);

  const renderEditor = () => {
    if (!selectedFile || !isEditing) return null;
    return (
      <div className = "h-[calc(100vh-3rem)]">
        <MDXEditor 
          file={selectedFile} 
          onSave={handleSave} 
          onCancel={handleCancel} 
          refreshFileStructure={fetchFileStructure}
          onChangesPending={handleChangesPending}
        />
        </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200 ${openSans.className}`}>
      <div className="fixed top-0 left-0 right-0 h-12 p-1 flex justify-end overflow-visible bg-gray-100 dark:bg-gray-800 transition-colors duration-200 border-gray-header shadow-lg z-[2000]">
        <Header 
          onFileSelect={handleFileSelect}
          isMobile={isMobile}
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={toggleSidebar}
          isEditing={isEditing}
        />
      </div>
      
      <div className="flex flex-1 relative pt-12">
        {!isEditing && (
          <div className={`sticky top-12 h-[calc(100vh-3rem)] transition-all duration-300 ease-in-out ${isSidebarVisible ? (session ? 'w-[20rem]' : 'w-fit max-w-[16rem]') : 'w-0'} overflow-hidden`}>
            {memoizedSidebar}
          </div>
        )}
        <main className={`flex-1 bg-background-light overflow-y-auto ${isEditing ? 'w-full' : ''}`}>
          <div className={`mx-auto ${isEditing ? '' : 'px-6'} relative`}>
            {isTrashBinVisible ? (
              <TrashBin onDelete={handleDeleteClick} />
            ) : (
              selectedFile && !isEditing ? (
                <>
                  <MarkdownRenderer 
                    content={fileContent} 
                    currentPage={selectedFile}
                    pages={fileStructure}
                    session={session}
                  />
                </>
              ) : (
                renderEditor() || <div>Select a file from the sidebar</div>
              )
            )}
          </div>
          {!isEditing && !isTrashBinVisible && (
            <>
              <div className="fixed z-[1999] border border-gray-200 dark:border-gray-600 top-[2.75rem] right-5 bg-[#F3F4F6] dark:bg-gray-800 shadow-lg rounded-b-xl px-4 py-2 flex gap-4">
                {session && canModifyContent && (
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
      {!isEditing && <Footer />}
      <SavePromptModal 
        isOpen={isPromptOpen}
        onSave={handleSaveAndNavigate}
        onDiscard={handleDiscardAndNavigate}
        onClose={() => setIsPromptOpen(false)}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
          setDeleteModalSource(null);
        }}
        itemTitle={itemToDelete?.title}
        hasChildren={itemToDelete?.hasChildren}
        source={deleteModalSource}
      />
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        fileStructure={fileStructure}
        onImport={() => {
          setIsImportModalOpen(false);
          fetchFileStructure();
        }}
      />
    </div>
  );
};

export default React.memo(MainAppLayout);
