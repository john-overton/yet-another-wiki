'use client';

import { useState, useEffect } from 'react';

const PromotionModal = ({ isOpen, onClose, promotion, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'giveaway',
    startDate: '',
    endDate: '',
    description: '',
    details: '',
    maxGiveaways: 100
  });

  useEffect(() => {
    if (promotion) {
      setFormData({
        type: promotion.type || 'giveaway',
        startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '',
        endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
        description: promotion.description || '',
        details: promotion.details || '',
        maxGiveaways: promotion.maxGiveaways || 100
      });
    }
  }, [promotion]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      maxGiveaways: parseInt(formData.maxGiveaways),
      remainingGiveaways: parseInt(formData.maxGiveaways),
      usedGiveaways: 0,
      clicksClosed: 0,
      clicksOpened: 0,
      registrations: 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {promotion ? 'Edit Promotion' : 'New Promotion'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            >
              <option value="giveaway">Giveaway</option>
              <option value="sale" disabled>Sale (Coming Soon)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Banner Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              placeholder="Short description for the banner"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Promotion Details
            </label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              rows={4}
              placeholder="Full promotion details shown in modal"
              required
            />
          </div>

          {formData.type === 'giveaway' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maximum Pro Licenses
              </label>
              <input
                type="number"
                value={formData.maxGiveaways}
                onChange={(e) => setFormData(prev => ({ ...prev, maxGiveaways: e.target.value }))}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                min="1"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2"
            >
              <i className="ri-save-line"></i>
              Save Promotion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatsModal = ({ isOpen, onClose, promotion }) => {
  if (!isOpen || !promotion) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Promotion Statistics</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Banner Closes</div>
              <div className="text-2xl font-semibold">{promotion.clicksClosed}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Modal Opens</div>
              <div className="text-2xl font-semibold">{promotion.clicksOpened}</div>
            </div>
          </div>

          {promotion.type === 'giveaway' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Pro Licenses Used</div>
                <div className="text-2xl font-semibold">{promotion.usedGiveaways}</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Licenses Remaining</div>
                <div className="text-2xl font-semibold">{promotion.remainingGiveaways}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Registrations</div>
              <div className="text-2xl font-semibold">{promotion.registrations}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PromotionsSettings() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const response = await fetch('/api/settings/promotions');
      if (!response.ok) {
        throw new Error('Failed to load promotions');
      }
      const data = await response.json();
      setPromotions(data);
    } catch (err) {
      setError('Failed to load promotions');
      console.error('Error loading promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (promotionData) => {
    try {
      const response = await fetch('/api/settings/promotions', {
        method: editingPromotion ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...promotionData,
          id: editingPromotion?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save promotion');
      }

      await loadPromotions();
      setShowModal(false);
      setEditingPromotion(null);
    } catch (err) {
      console.error('Error saving promotion:', err);
      setError('Failed to save promotion');
    }
  };

  const handleDelete = async (promotion) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      const response = await fetch('/api/settings/promotions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: promotion.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete promotion');
      }

      await loadPromotions();
    } catch (err) {
      console.error('Error deleting promotion:', err);
      setError('Failed to delete promotion');
    }
  };

  const handleStartNow = async (promotion) => {
    try {
      const response = await fetch('/api/settings/promotions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...promotion,
          startDate: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update promotion');
      }

      await loadPromotions();
    } catch (err) {
      console.error('Error updating promotion:', err);
      setError('Failed to update promotion');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading promotions...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Promotions</h2>
        <button
          onClick={() => {
            setEditingPromotion(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:text-white text-black hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2"
        >
          <i className="ri-add-line"></i>
          New Promotion
        </button>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
          No promotions found. Create one to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {promotions.map((promotion) => {
            const startDate = new Date(promotion.startDate);
            const endDate = new Date(promotion.endDate);
            const now = new Date();
            const isActive = startDate <= now && endDate >= now;
            const hasStarted = startDate <= now;
            const hasEnded = endDate < now;

            return (
              <div
                key={promotion.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium">{promotion.description}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {promotion.type === 'giveaway' ? '🎁 Giveaway' : '💰 Sale'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedPromotion(promotion);
                        setShowStatsModal(true);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      title="View Statistics"
                    >
                      <i className="ri-bar-chart-line text-xl"></i>
                    </button>
                    <button
                      onClick={() => {
                        setEditingPromotion(promotion);
                        setShowModal(true);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      title="Edit Promotion"
                    >
                      <i className="ri-edit-line text-xl"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(promotion)}
                      className="text-gray-500 hover:text-red-500"
                      title="Delete Promotion"
                    >
                      <i className="ri-delete-bin-line text-xl"></i>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Start Date</div>
                    <div>{startDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">End Date</div>
                    <div>{endDate.toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : hasEnded
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {isActive ? 'Active' : hasEnded ? 'Ended' : 'Scheduled'}
                    </span>
                    {promotion.type === 'giveaway' && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {promotion.remainingGiveaways} of {promotion.maxGiveaways} licenses remaining
                      </span>
                    )}
                  </div>
                  {!hasStarted && (
                    <button
                      onClick={() => handleStartNow(promotion)}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Start Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PromotionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPromotion(null);
        }}
        promotion={editingPromotion}
        onSave={handleSave}
      />

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => {
          setShowStatsModal(false);
          setSelectedPromotion(null);
        }}
        promotion={selectedPromotion}
      />
    </div>
  );
}
