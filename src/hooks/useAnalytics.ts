import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnalyticsService } from '../services/analytics';

export function useAnalytics() {
  const location = useLocation();
  const analytics = AnalyticsService.getInstance();

  useEffect(() => {
    analytics.trackPageView(location.pathname + location.search);
  }, [location]);

  return analytics;
} 