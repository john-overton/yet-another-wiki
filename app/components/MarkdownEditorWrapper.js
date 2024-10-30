'use client';

import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import { Open_Sans } from 'next/font/google';
import '../quill.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

// Import required formats
const Header = Quill.import('formats/header');
const Bold = Quill.import('formats/bold');
const Italic = Quill.import('formats/italic');
const List = Quill.import('formats/list');
const Link = Quill.import('formats/link');
const Code = Quill.import('formats/code');
const CodeBlock = Quill.import('formats/code-block');
const Blockquote = Quill.import('formats/blockquote');

// Register formats
Quill.register({
  'formats/header': Header,
  'formats/bold': Bold,
  'formats/italic': Italic,
  'formats/list': List,
  'formats/link': Link,
  'formats/code': Code,
  'formats/code-block': CodeBlock,
  'formats/blockquote': Blockquote,
});

const QuillWrapper = ({ value, onChange, onUpload, style, className }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const toolbarRef = useRef(null);

  const handleUpload = async (file) => {
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
      return null;
    }
  };

  useEffect(() => {
    if (!editorRef.current || !toolbarRef.current) return;

    const quill = new Quill(editorRef.current, {
      modules: {
        toolbar: toolbarRef.current,
        history: {
          delay: 1000,
          maxStack: 500,
          userOnly: true
        },
        keyboard: {
          bindings: {
            'list autofill': {
              key: ' ',
              shiftKey: null,
              prefix: /^(1\.|-)$/,
              handler(range, context) {
                const prefix = context.prefix;
                if (prefix === '1.') {
                  this.quill.formatLine(range.index, 1, 'list', 'ordered');
                } else if (prefix === '-') {
                  this.quill.formatLine(range.index, 1, 'list', 'bullet');
                }
                this.quill.deleteText(range.index - prefix.length, prefix.length);
              }
            }
          }
        }
      },
      placeholder: 'Start writing...',
      theme: 'snow',
      formats: [
        'header',
        'bold', 'italic',
        'blockquote', 'code-block',
        'list',
        'link', 'image'
      ]
    });

    // Set initial content
    if (value) {
      quill.root.innerHTML = value;
    }

    // Handle content changes
    quill.on('text-change', () => {
      if (onChange) {
        onChange(quill.root.innerHTML);
      }
    });

    // Setup image handler
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', function() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        if (file) {
          const url = await handleUpload(file);
          if (url) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', url);
          }
        }
      };
    });

    quillRef.current = quill;

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
      }
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className={`${className} ${openSans.className}`} style={{
      ...style,
      fontFamily: openSans.style.fontFamily,
    }}>
      <div ref={toolbarRef}>
        <span className="ql-formats">
          <select className="ql-header">
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option selected>Normal</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote"></button>
          <button className="ql-code-block"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-clean"></button>
        </span>
      </div>
      <div ref={editorRef} style={{
        minHeight: 'calc(100vh - 300px)',
        height: '100%',
        width: '100%',
      }} />
    </div>
  );
};

export default QuillWrapper;
