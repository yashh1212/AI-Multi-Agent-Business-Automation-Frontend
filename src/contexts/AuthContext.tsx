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
  email: "admin@Businessauto.com",
  password: "admin123",
  user: {
    name: "Admin",
    email: "admin@Businessauto.com",
    role: "Administrator",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("Business Auto_auth") === "true";
  });

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("Business Auto_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    localStorage.setItem("Business Auto_auth", String(isAuthenticated));
    if (user) {
      localStorage.setItem("Business Auto_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("Business Auto_user");
    }
  }, [isAuthenticated, user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    // await new Promise((resolve) => setTimeout(resolve, 1200));
    const res=await fetch("http://localhost:5000/auth/login", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    }).then(res=>res.json());

    if(res.success) {
      setUser(DEMO_CREDENTIALS.user);
      setIsAuthenticated(true);
      sessionStorage.setItem("login","true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("Business Auto_auth");
    localStorage.removeItem("Business Auto_user");
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
