import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const authStatus = authService.isAuthenticated();
    console.log("🔐 Initial auth status:", authStatus);
    return authStatus;
  });

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authStatus = authService.isAuthenticated();
      console.log("🔄 Auth status changed:", authStatus);
      setIsAuthenticated(authStatus);
    };

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener("storage", checkAuth);

    // Custom event for same-tab login/logout
    window.addEventListener("auth-change", checkAuth);

    // Cleanup
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const login = () => {
    console.log("✅ Login called - setting authenticated to true");
    setIsAuthenticated(true);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("auth-change"));
  };

  const logout = () => {
    console.log("🚪 Logout called - setting authenticated to false");
    setIsAuthenticated(false);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("auth-change"));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
