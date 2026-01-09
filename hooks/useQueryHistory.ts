import { useState, useEffect } from 'react';

const HISTORY_STORAGE_KEY = 'sql_lens_query_history';
const MAX_HISTORY_ITEMS = 15;

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

export const useQueryHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  // Add query to history
  const addToHistory = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Remove duplicate if it exists (move to top)
    setHistory(prev => {
      const filtered = prev.filter(item => item.query !== trimmedQuery);
      
      // Add new item at the beginning
      const newHistory = [
        {
          id: `${Date.now()}-${Math.random()}`,
          query: trimmedQuery,
          timestamp: Date.now()
        },
        ...filtered
      ];

      // Keep only last MAX_HISTORY_ITEMS
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  // Remove specific query from history
  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    isLoaded
  };
};

