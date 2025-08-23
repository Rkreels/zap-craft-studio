import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UseRealTimeUpdatesOptions {
  queryKeys: string[];
  interval?: number;
  enabled?: boolean;
}

export const useRealTimeUpdates = ({ 
  queryKeys, 
  interval = 30000, 
  enabled = true 
}: UseRealTimeUpdatesOptions) => {
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const updateQueries = () => {
      queryKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    };

    // Set up interval for periodic updates
    intervalRef.current = setInterval(updateQueries, interval);

    // Listen for storage changes for cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('zapier_clone_')) {
        updateQueries();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [queryKeys, interval, enabled, queryClient]);

  const triggerUpdate = () => {
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  };

  return { triggerUpdate };
};