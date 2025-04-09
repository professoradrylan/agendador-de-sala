import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { APP_CONFIG } from '@/config/constants';

export const useProtectedRoute = (requireAdmin: boolean = false) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate(APP_CONFIG.ROUTES.LOGIN, { replace: true });
      } else if (requireAdmin && !isAdmin) {
        navigate(APP_CONFIG.ROUTES.DASHBOARD, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, navigate, requireAdmin]);

  return { isAuthenticated, isLoading, isAdmin };
}; 