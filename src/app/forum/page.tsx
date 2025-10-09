'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChatBubbleLeftRightIcon, 
  ArrowLeftIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  FunnelIcon,
  ClockIcon,
  FireIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  upvotes: number;
  downvotes: number;
  netVotes: number;
  createdAt: string;
  _count: {
    votes: number;
    comments: number;
  };
}

const CATEGORIES = [
  { value: 'All', label: 'All Categories', color: 'cyan' },
  { value: 'PUBLIC_SAFETY', label: 'Public Safety', color: 'red' },
  { value: 'TRANSPORTATION', label: 'Transportation', color: 'blue' },
  { value: 'HEALTH', label: 'Health', color: 'green' },
  { value: 'EDUCATION', label: 'Education', color: 'purple' },
  { value: 'HOUSING', label: 'Housing', color: 'orange' },
  { value: 'ENVIRONMENT', label: 'Environment', color: 'emerald' },
  { value: 'BUSINESS', label: 'Business', color: 'indigo' },
  { value: 'ECONOMY', label: 'Economy', color: 'yellow' }
];

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'createdAt' | 'upvotes'>('upvotes');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({});
  const [optimisticVotes, setOptimisticVotes] = useState<Record<string, { upvotes: number; downvotes: number; netVotes: number }>>({});
  
  // Create post form state
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: '',
    category: 'PUBLIC_SAFETY'
  });

  // Generate a persistent user ID (in a real app, this would be from auth)
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('forumUserId');
      if (!id) {
        id = `user_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('forumUserId', id);
      }
      return id;
    }
    return 'anonymous';
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        sortBy: sortBy,
        sortOrder: 'desc',
        limit: '50'
      });
      
      const response = await fetch(`/api/forum/posts?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId: string, voteType: 'UP' | 'DOWN', retryCount = 0) => {
    // Prevent multiple rapid votes
    if (votingStates[postId]) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Set voting state
    setVotingStates(prev => ({ ...prev, [postId]: true }));

    // Optimistic update
    const currentOptimistic = optimisticVotes[postId];
    let newUpvotes = currentOptimistic?.upvotes ?? post.upvotes;
    let newDownvotes = currentOptimistic?.downvotes ?? post.downvotes;

    // Calculate optimistic vote counts - simple increment
    if (voteType === 'UP') {
      newUpvotes += 1;
    } else {
      newDownvotes += 1;
    }

    // Apply optimistic update
    setOptimisticVotes(prev => ({
      ...prev,
      [postId]: {
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        netVotes: newUpvotes - newDownvotes
      }
    }));

    try {
      const response = await fetch(`/api/forum/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, voteType })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the post with real data
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, upvotes: data.data.upvotes, downvotes: data.data.downvotes, netVotes: data.data.netVotes }
            : post
        ));
        
        // Clear optimistic vote
        setOptimisticVotes(prev => {
          const newState = { ...prev };
          delete newState[postId];
          return newState;
        });
      } else {
        // Revert optimistic update on error
        setOptimisticVotes(prev => {
          const newState = { ...prev };
          delete newState[postId];
          return newState;
        });

        // Handle specific error cases
        if (response.status === 409 && retryCount < 2) {
          // Retry on conflict (concurrent vote)
          console.log('Retrying vote due to conflict...');
          setTimeout(() => handleVote(postId, voteType, retryCount + 1), 500);
        } else {
          console.error('Vote failed:', data.error);
          // Could show user notification here
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
      
      // Revert optimistic update on error
      setOptimisticVotes(prev => {
        const newState = { ...prev };
        delete newState[postId];
        return newState;
      });

      if (retryCount < 2) {
        // Retry on network error
        setTimeout(() => handleVote(postId, voteType, retryCount + 1), 1000);
      }
    } finally {
      // Clear voting state
      setVotingStates(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowCreateModal(false);
        setNewPost({ title: '', content: '', author: '', category: 'PUBLIC_SAFETY' });
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    return CATEGORIES.find(c => c.value === category)?.color || 'gray';
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="h-screen bg-[#0a0e1a] text-white flex flex-col">
      {/* Fixed Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-b border-blue-500/30 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
          <Link 
            href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-xs">Back to Dashboard</span>
          </Link>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors text-sm font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              New Post
            </button>
          </div>
          
          <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-cyan-400" />
            NYC Community Forum
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Share data suggestions and vote on what matters most to you
          </p>
        </div>
      </div>

      {/* Fixed Filters */}
      <div className="bg-[#0f1419] border-b border-[#1f2937] flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Category Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FunnelIcon className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">Filter by Category</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      selectedCategory === cat.value
                        ? 'bg-[#1e293b] text-white border border-[#334155]'
                        : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937] hover:border-[#334155]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400">Sort by</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setSortBy('upvotes')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    sortBy === 'upvotes'
                      ? 'bg-orange-500 text-white'
                      : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
                  }`}
                >
                  <FireIcon className="w-3 h-3" />
                  Hot
                </button>
                <button
                  onClick={() => setSortBy('createdAt')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    sortBy === 'createdAt'
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
                  }`}
                >
                  <ClockIcon className="w-3 h-3" />
                  New
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Posts Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Posts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-[#111827] border border-[#1f2937] rounded-lg">
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No posts yet. Be the first to share your idea!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-[#111827] border border-[#1f2937] rounded-lg p-3 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex gap-3">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center gap-0.5 min-w-[36px]">
                    <button
                      onClick={() => handleVote(post.id, 'UP')}
                      disabled={votingStates[post.id]}
                      className={`p-1 rounded transition-all duration-200 text-gray-400 hover:bg-green-500/10 hover:text-green-400 hover:scale-105 ${votingStates[post.id] ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {votingStates[post.id] ? (
                        <ArrowPathIcon className="w-4 h-4 animate-spin text-cyan-400" />
                      ) : (
                        <ArrowUpIcon className="w-4 h-4" />
                      )}
                    </button>
                    
                    <span className={`text-xs font-bold transition-colors duration-200 ${
                      (optimisticVotes[post.id]?.netVotes ?? post.netVotes) > 0 ? 'text-green-400' : 
                      (optimisticVotes[post.id]?.netVotes ?? post.netVotes) < 0 ? 'text-red-400' : 
                      'text-gray-400'
                    }`}>
                      {optimisticVotes[post.id]?.netVotes ?? post.netVotes}
                    </span>
                    
                    <button
                      onClick={() => handleVote(post.id, 'DOWN')}
                      disabled={votingStates[post.id]}
                      className={`p-1 rounded transition-all duration-200 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:scale-105 ${votingStates[post.id] ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {votingStates[post.id] ? (
                        <ArrowPathIcon className="w-4 h-4 animate-spin text-cyan-400" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium bg-${getCategoryColor(post.category)}-500/20 text-${getCategoryColor(post.category)}-400 border border-${getCategoryColor(post.category)}-500/30`}>
                        {CATEGORIES.find(c => c.value === post.category)?.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        by {post.author}
                      </span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(post.createdAt)}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">
                      {post.title}
                    </h3>
                    
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 mb-2">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{post._count.comments} comments</span>
                      <span>•</span>
                      <span className={optimisticVotes[post.id] ? 'text-cyan-400' : ''}>
                        {optimisticVotes[post.id]?.upvotes ?? post.upvotes} upvotes
                      </span>
                      <span>•</span>
                      <span className={optimisticVotes[post.id] ? 'text-orange-400' : ''}>
                        {optimisticVotes[post.id]?.downvotes ?? post.downvotes} downvotes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Post</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={newPost.author}
                  onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                >
                  {CATEGORIES.filter(c => c.value !== 'All').map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
            </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                  placeholder="What data would you like to see?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg focus:outline-none focus:border-cyan-500 text-white resize-none"
                  placeholder="Explain why this data would be valuable..."
                />
          </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors"
                >
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#1f2937] hover:bg-[#2a3441] rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
          </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}