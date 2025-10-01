'use client';

import { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface RefreshDataButtonProps {
  onRefresh?: () => void;
}

export default function RefreshDataButton({ onRefresh }: RefreshDataButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setMessage('Clearing cache...');

      // Clear both server and client cache
      const response = await fetch('/api/cache/clear');
      const result = await response.json();

      if (result.success || result.clearedCount === 0) {
        setMessage('Refreshing data...');
        
        // Trigger refetch which will clear client cache too
        if (onRefresh) {
          onRefresh();
        } else {
          window.location.reload();
        }
        
        // Reset state after a moment
        setTimeout(() => {
          setIsRefreshing(false);
          setMessage('');
        }, 2000);
      } else {
        setMessage('Failed to clear cache');
        setIsRefreshing(false);
      }
    } catch (error) {
      console.error('Refresh error:', error);
      setMessage('Error refreshing data');
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isRefreshing
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-cyan-500 text-white hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30'
        }`}
      >
        <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
      </button>
      
      {message && (
        <span className={`text-sm ${
          message.includes('Error') || message.includes('Failed') 
            ? 'text-red-400' 
            : 'text-cyan-400'
        }`}>
          {message}
        </span>
      )}
    </div>
  );
}

