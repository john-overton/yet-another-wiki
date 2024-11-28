'use client';

import { useState, useEffect, useCallback } from 'react';

export default function DevItemModal({ item, isOpen, onClose, onStatusUpdate, session, onVote }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [adminNotes, setAdminNotes] = useState(item?.adminNotes || '');
  const [status, setStatus] = useState(item?.status || 'new');
  const [loading, setLoading] = useState(false);

  const loadComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/dev-items/comments?itemId=${item.id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, [item?.id]);

  useEffect(() => {
    if (isOpen && item) {
      loadComments();
    }
  }, [isOpen, item, loadComments]);

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch('/api/dev-items/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
          content: newComment,
        }),
      });

      if (response.ok) {
        setNewComment('');
        loadComments();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleReply = async (parentId) => {
    if (!replyContent.trim()) return;

    try {
      const response = await fetch('/api/dev-items/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
          content: replyContent,
          parentId,
        }),
      });

      if (response.ok) {
        setReplyContent('');
        setReplyTo(null);
        loadComments();
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      await onStatusUpdate(item.id, status, adminNotes);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isAdmin = session?.user?.role === 'Admin';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className={`px-2 py-1 rounded-full text-xs ${
              item.type === 'bug'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {item.type}
            </span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          <div className="mb-6">
            <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              {item.details}
            </pre>
          </div>

          {/* Developer Comments Section - Visible to all, editable by admin */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Developer Comments</h3>
            {isAdmin ? (
              <>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mb-2"
                  rows={3}
                  placeholder="Add developer comments..."
                />
                <div className="flex items-center gap-4">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </>
            ) : item.adminNotes ? (
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {item.adminNotes}
                </pre>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Status: <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'new'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : item.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No developer comments yet.</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Comments</h3>
            {session ? (
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  rows={3}
                />
                <button
                  onClick={handleComment}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Post Comment
                </button>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mb-4">Please sign in to comment.</p>
            )}

            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.user.name}
                    </span>
                    {comment.user.is_pro && (
                      <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-0.5 rounded-full">
                        PRO
                      </span>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                  
                  {session && (
                    <button
                      onClick={() => setReplyTo(comment.id)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Reply
                    </button>
                  )}

                  {replyTo === comment.id && (
                    <div className="mt-2">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        rows={2}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleReply(comment.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Post Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyTo(null);
                            setReplyContent('');
                          }}
                          className="px-3 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {comment.replies?.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 mt-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {reply.user.name}
                            </span>
                            {reply.user.is_pro && (
                              <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-0.5 rounded-full">
                                PRO
                              </span>
                            )}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onVote}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                item.votes?.some(v => v.userId === session?.user?.id)
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200'
              }`}
            >
              <i className="ri-arrow-up-line"></i>
              <span>{item._count?.votes || 0} votes</span>
            </button>
            <span className="text-gray-500 dark:text-gray-400">
              {item.views} views
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created on {new Date(item.dateCreated).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
