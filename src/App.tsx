import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Bookings from "./pages/Bookings";
import NewBooking from "./pages/NewBooking";
import NotFound from "./pages/NotFound";
import { APP_CONFIG } from "@/config/constants";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

const queryClient = new QueryClient();

// Componente de rota protegida
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const { isLoading } = useProtectedRoute(requireAdmin);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return <>{children}</>;
};

// Componente de rota de autenticação
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(APP_CONFIG.ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path={APP_CONFIG.ROUTES.HOME} element={<Navigate to={APP_CONFIG.ROUTES.DASHBOARD} replace />} />
    
    {/* Rotas de autenticação */}
    <Route path={APP_CONFIG.ROUTES.LOGIN} element={<AuthRoute><Login /></AuthRoute>} />
    <Route path={APP_CONFIG.ROUTES.SIGNUP} element={<AuthRoute><SignUp /></AuthRoute>} />
    
    {/* Rotas protegidas */}
    <Route path={APP_CONFIG.ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path={APP_CONFIG.ROUTES.ROOMS} element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
    <Route path={APP_CONFIG.ROUTES.ROOM_DETAILS} element={<ProtectedRoute><RoomDetails /></ProtectedRoute>} />
    <Route path={APP_CONFIG.ROUTES.BOOKINGS} element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
    <Route path={APP_CONFIG.ROUTES.NEW_BOOKING} element={<ProtectedRoute><NewBooking /></ProtectedRoute>} />
    
    {/* Rota 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Layout>
              <AppRoutes />
            </Layout>
            <Toaster />
            <Sonner />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
