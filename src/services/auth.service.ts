import { User } from "@/models/types";
import { APP_CONFIG, DEMO_USERS } from "@/config/constants";

export class AuthService {
  private static instance: AuthService;
  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<User | null> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const matchedUser = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (matchedUser) {
      const safeUser: User = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
      };
      
      this.setUserData(safeUser);
      return safeUser;
    }
    
    return null;
  }

  async signup(name: string, email: string, password: string): Promise<User | null> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (DEMO_USERS.some((u) => u.email === email)) {
      return null;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "user",
    };

    this.setUserData(newUser);
    return newUser;
  }

  logout(): void {
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
  }

  getStoredUser(): User | null {
    const storedUser = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        return null;
      }
    }
    return null;
  }

  private setUserData(user: User): void {
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    // Em um ambiente real, aqui seria armazenado um token JWT
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.TOKEN, 'demo-token');
  }
} 