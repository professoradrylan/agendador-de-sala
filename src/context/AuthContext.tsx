import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/models/types";
import { AuthService } from "@/services/auth.service";
import { APP_CONFIG } from "@/config/constants";

// Mock data for demo purposes
const DEMO_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user123",
    name: "Regular User",
    role: "user" as const,
  },
];

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const authService = AuthService.getInstance();

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      
      if (user) {
        setUser(user);
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo de volta, ${user.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha inválidos. Por favor, tente novamente.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Falha no login",
        description: "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await authService.signup(name, email, password);
      
      if (user) {
        setUser(user);
        toast({
          title: "Cadastro realizado com sucesso",
          description: `Bem-vindo, ${name}!`,
        });
        return true;
      } else {
        toast({
          title: "Falha no cadastro",
          description: "Email já está em uso. Por favor, tente outro.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast({
        title: "Falha no cadastro",
        description: "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === "admin" || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
