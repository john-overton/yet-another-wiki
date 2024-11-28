'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DevItemModal from './components/DevItemModal';
import AddDevItemModal from './components/AddDevItemModal';
import { useTheme } from 'next-themes';

export default function DevFeatures() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('votes');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  const { resolvedTheme } = useTheme();

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/dev-items?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(searchTerm)}&sort=${sortBy}&type=${filterType}&status=${filterStatus}`
      );
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error loading items:', error);
      setMessage('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, searchTerm, sortBy, filterType, filterStatus]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleVote = async (itemId) => {
    if (!session) {
      setMessage('Please sign in to vote');
      return;
    }

    try {
      const response = await fetch('/api/dev-items/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (response.ok) {
        loadItems();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      setMessage('Failed to vote');
    }
  };

  const handleAddSubmit = async (data) => {
    if (!session) {
      setMessage('Please sign in to submit a request');
      return;
    }

    try {
      const response = await fetch('/api/dev-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('Item added successfully');
        loadItems();
        setIsAddModalOpen(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setMessage('Failed to add item');
    }
  };

  const handleStatusUpdate = async (id, status, adminNotes) => {
    if (!session?.user?.email) {
      setMessage('Please sign in to update status');
      return;
    }

    try {
      const response = await fetch('/api/dev-items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status, adminNotes }),
      });

      if (response.ok) {
        setMessage('Status updated successfully');
        loadItems();
        setIsModalOpen(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('Failed to update status');
    }
  };

  const Pagination = () => (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-2">
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border rounded px-2 py-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="ri-arrow-left-line"></i>
          Previous
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <i className="ri-arrow-right-line"></i>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="fixed top-0 left-0 right-0 h-12 p-1 flex justify-end overflow-visible bg-gray-100 dark:bg-gray-800 transition-colors duration-200 border-gray-header shadow-lg z-[2000]">
        <Header />
      </div>

      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Development Features & Bugs</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Add Request
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.includes('success')
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests..."
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              {loading && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            >
              <option value="votes">Most Voted</option>
              <option value="views">Most Viewed</option>
              <option value="newest">Newest</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="bug">Bugs</option>
              <option value="feature">Features</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            >
              <option value="active">Active Items</option>
              <option value="all">All Items</option>
              <option value="done">Completed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Votes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => {
                    setSelectedItem(item);
                    setIsModalOpen(true);
                  }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(item.id);
                          }}
                          className={`text-xl ${
                            item.votes?.some(v => v.userId === session?.user?.id)
                              ? 'text-blue-500'
                              : 'text-gray-400 hover:text-blue-500'
                          }`}
                        >
                          <i className="ri-arrow-up-line"></i>
                        </button>
                        <span className="text-gray-900 dark:text-gray-100">
                          {item._count?.votes || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.type === 'bug'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'new'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : item.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.dateCreated).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination />
        </div>
      </main>

      <Footer />

      {selectedItem && (
        <DevItemModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          onStatusUpdate={handleStatusUpdate}
          session={session}
          onVote={() => handleVote(selectedItem.id)}
        />
      )}

      <AddDevItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />
    </div>
  );
}
