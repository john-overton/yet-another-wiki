'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import SortOrderEditor from './SortOrderEditor';

// Import QuillWrapper with no SSR
const QuillWrapper = dynamic(() => import('./MarkdownEditorWrapper'), {
  ssr: false
});

const MarkdownEditor = ({ file, onSave, onCancel }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState(file.title);
  const [isPublic, setIsPublic] = useState(file.isPublic);
  const [slug, setSlug] = useState(file.slug);
  const [version, setVersion] = useState(file.version || 1);
  const [errorMessage, setErrorMessage] = useState('');
  const [slugError, setSlugError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const validateSlug = (value) => {
    // Only allow lowercase letters, numbers, and hyphens
    const slugRegex = /^[a-z0-9-]*$/;
    if (!slugRegex.test(value)) {
      setSlugError('Slug can only contain lowercase letters, numbers, and hyphens');
      return false;
    }
    setSlugError('');
    return true;
  };

  const handleSlugChange = (e) => {
    const newSlug = e.target.value.toLowerCase();
    if (validateSlug(newSlug)) {
      setSlug(newSlug);
    }
  };

  const handleUpload = useCallback(async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Determine if this is an image file
      const isImage = file.type.startsWith('image/');
      const endpoint = isImage ? '/api/upload-image' : '/api/upload-file';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Failed to upload file. Please try again.');
      return null;
    }
  }, []);

  const handleSortOrderChange = async (path, newSortOrder) => {
    try {
      const response = await fetch('/api/update-sort-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          newSortOrder
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update sort order');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error updating sort order:', error);
      setErrorMessage('Failed to update sort order. Please try again.');
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/file-content?path=${encodeURIComponent(file.path)}`);
        const fileContent = await response.text();
        if (fileContent) {
          setContent(fileContent);
        }
      } catch (error) {
        console.error('Error fetching file content:', error);
        setErrorMessage('Failed to fetch file content. Please try again.');
      }
    };
    fetchContent();
  }, [file.path, mounted]);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      setErrorMessage('');

      if (!content || content.trim() === '') {
        setErrorMessage('Cannot save empty content');
        return;
      }

      if (!validateSlug(slug)) {
        return;
      }

      const response = await fetch('/api/update-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: file.path,
          content,
          title: title || file.title,
          isPublic,
          slug: slug || file.title,
          version,
          oldPath: file.path // Send the old path for renaming
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save file');
      }

      const updatedFile = { ...file, title, isPublic, slug, version, path: `${slug}.md` };
      onSave(updatedFile);
      setVersion(prevVersion => prevVersion + 1);
    } catch (error) {
      console.error('Error saving file:', error);
      setErrorMessage(`An error occurred while saving the file: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [content, file, title, isPublic, slug, version, onSave, isSaving]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (!mounted) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Page Title</label>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">URL Slug</label>
          <input
            type="text"
            value={slug || ''}
            onChange={handleSlugChange}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {slugError && (
            <div className="text-red-500 text-sm mt-1">{slugError}</div>
          )}
        </div>
        <SortOrderEditor file={file} onSortOrderChange={handleSortOrderChange} />
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Public</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600"
              style={{ fontSize: '1.5rem' }}
              title="Cancel"
            >
              <i className="ri-close-line"></i>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ fontSize: '1.5rem' }}
              title={`Save (Ctrl+S)${isSaving ? ' - Saving...' : ''}`}
            >
              <i className={`ri-save-line ${isSaving ? 'animate-pulse' : ''}`}></i>
            </button>
          </div>
        </div>
      </div>
      {errorMessage && (
        <div className="text-red-500 mb-4">{errorMessage}</div>
      )}
      <div className="flex-grow">
        <QuillWrapper
          value={content}
          onChange={setContent}
          onUpload={handleUpload}
          className="quill-editor"
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
