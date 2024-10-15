'use client';

import { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import TableOfContents from './TableOfContents';

const CopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-sm"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

const CodeBlock = ({ children, className }) => {
  const language = className ? className.replace('language-', '') : 'javascript';
  const code = children.props.children;

  return (
    <div className="relative">
      <pre className={`language-${language} bg-gray-800 p-4 rounded-md overflow-x-auto mb-4`}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <CopyButton code={code} />
    </div>
  );
};

const generateId = (text) => {
  return text.toLowerCase().replace(/[^\w]/g, '-');
};

const createHeadingComponent = (level) => {
  return ({ children, ...props }) => {
    const id = generateId(children);
    const Component = `h${level}`;
    const className = `text-${4-level}xl font-bold mt-${10-level} mb-${6-level/2}`;
    return <Component id={id} className={className} {...props}>{children}</Component>;
  };
};

const components = {
  h1: createHeadingComponent(1),
  h2: createHeadingComponent(2),
  h3: createHeadingComponent(3),
  h4: createHeadingComponent(4),
  h5: createHeadingComponent(5),
  h6: createHeadingComponent(6),
  p: (props) => <p className="mb-4" {...props} />,
  a: (props) => <Link className="text-blue-500 hover:underline" {...props} />,
  ul: (props) => <ul className="list-disc list-inside mb-4" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside mb-4" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,
  blockquote: (props) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4" {...props} />,
  table: (props) => <table className="min-w-full border border-gray-300 mb-4" {...props} />,
  tr: (props) => <tr className="border-b border-gray-300" {...props} />,
  th: (props) => <th className="border border-gray-300 px-4 py-2 bg-gray-100" {...props} />,
  td: (props) => <td className="border border-gray-300 px-4 py-2" {...props} />,
  pre: CodeBlock,
  code: (props) => {
    const language = props.className ? props.className.replace('language-', '') : 'javascript';
    return (
      <code
        className={`language-${language}`}
        {...props}
      />
    );
  },
};

const MDXRenderer = ({ source }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [source]);

  return (
    <div className="mdx-content prose dark:prose-invert max-w-none relative">
      <TableOfContents source={source} />
      <MDXRemote source={source} components={components} />
    </div>
  );
};

export default MDXRenderer;