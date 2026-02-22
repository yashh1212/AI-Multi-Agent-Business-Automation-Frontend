import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_CREDENTIALS = {
  email: "admin@nexusai.com",
  password: "admin123",
  user: {
    name: "Admin",
    email: "admin@nexusai.com",
    role: "Administrator",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("nexusai_auth") === "true";
  });

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("nexusai_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    localStorage.setItem("nexusai_auth", String(isAuthenticated));
    if (user) {
      localStorage.setItem("nexusai_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("nexusai_user");
    }
  }, [isAuthenticated, user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (
      email === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      setUser(DEMO_CREDENTIALS.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("nexusai_auth");
    localStorage.removeItem("nexusai_user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
