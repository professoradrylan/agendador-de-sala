import React from 'react';
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { isLoading } = useAuth();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }
  
  if (isAuthPage) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={`flex-1 p-4 ${isMobile ? 'ml-0' : 'ml-64'}`}>
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
