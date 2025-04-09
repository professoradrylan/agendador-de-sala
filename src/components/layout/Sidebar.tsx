import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Home,
  Users,
  LogOut,
  Menu,
  X,
  Building2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { APP_CONFIG } from "@/config/constants";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout, isAdmin } = useAuth();
  const isMobile = useIsMobile();

  // Close sidebar when changing routes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const navItems = [
    { name: "Dashboard", path: APP_CONFIG.ROUTES.DASHBOARD, icon: <Home size={20} /> },
    { name: "Salas", path: APP_CONFIG.ROUTES.ROOMS, icon: <Building2 size={20} /> },
    { name: "Reservas", path: APP_CONFIG.ROUTES.BOOKINGS, icon: <Calendar size={20} /> },
  ];

  const adminItems = [
    { name: "Gerenciar Usuários", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Configurações", path: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 md:hidden bg-background shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-30 w-64 bg-sidebar shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-sidebar-border">
            <h1 className="text-xl font-bold text-brand">MeetingMaster</h1>
            <p className="text-sm text-muted-foreground">Sistema de Agendamento</p>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-accent-foreground"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
              
              {isAdmin && (
                <>
                  <li className="pt-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase">
                      Administração
                    </div>
                  </li>
                  {adminItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={closeSidebar}
                        className={`flex items-center p-2 rounded-md transition-colors ${
                          location.pathname === item.path
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent text-accent-foreground"
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={logout}
            >
              <LogOut size={20} className="mr-3" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
