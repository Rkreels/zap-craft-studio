
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export const useSystemMonitoring = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [metrics, setMetrics] = useState({
    activeWorkflows: 0,
    totalRuns: 0,
    successRate: 95,
    avgExecutionTime: 1200,
  });
  
  const { data: health } = useQuery({
    queryKey: ['system-health'],
    queryFn: apiService.getSystemHealth,
    refetchInterval: 10000,
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeWorkflows: Math.max(0, prev.activeWorkflows + Math.floor(Math.random() * 3) - 1),
        totalRuns: prev.totalRuns + Math.floor(Math.random() * 5),
        successRate: Math.min(100, Math.max(85, prev.successRate + (Math.random() - 0.5) * 2)),
        avgExecutionTime: Math.max(500, prev.avgExecutionTime + (Math.random() - 0.5) * 100),
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return {
    isOnline,
    metrics,
    health: health || { status: 'healthy', uptime: '99.9%' },
  };
};
