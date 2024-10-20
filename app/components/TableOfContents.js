'use client';

import React, { useEffect, useState } from 'react';

const generateId = (text) => {
  return text.toLowerCase().replace(/[^\w]+/g, '-');
};

const TableOfContents = ({ source, isVisible }) => {
  const [toc, setToc] = useState([]);

  useEffect(() => {
    const headings = source.match(/^#{1,4} .+$/gm) || [];
    const tocItems = headings.map(heading => {
      const level = heading.match(/^#+/)[0].length;
      const text = heading.replace(/^#+\s/, '');
      const id = generateId(text);
      return { level, text, id };
    });
    setToc(tocItems);
  }, [source]);

  return (
    <div className="ml-1 mt-1 bg-gray-100 dark:bg-gray-800 shadow-lg">
      <h3 className="text-lg font-bold mb-4">Page Contents</h3>
      <ul className="space-y-2">
        {toc.map((item, index) => (
          <li key={index} style={{ paddingLeft: `${(item.level - 1) * 0.5}rem` }}>
            <a href={`#${item.id}`} className="hover:underline text-sm">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
