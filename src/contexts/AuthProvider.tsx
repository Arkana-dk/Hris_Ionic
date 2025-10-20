import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services";
import { User } from "../types/api.types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return authService.isAuthenticated();
  });

  const [user, setUser] = useState<User | null>(() => {
    return authService.getCurrentUser();
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state on mount
    const initAuth = () => {
      const authStatus = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();

      console.log("🔐 Initial auth status:", authStatus);
      console.log("👤 Initial user:", currentUser?.name || "No user");

      setIsAuthenticated(authStatus);
      setUser(currentUser);
      setLoading(false);
    };

    initAuth();

    // Check authentication status on storage changes
    const checkAuth = () => {
      const authStatus = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();

      console.log("🔄 Auth status changed:", authStatus);
      setIsAuthenticated(authStatus);
      setUser(currentUser);
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
    console.log("✅ Login called - updating auth state");
    const currentUser = authService.getCurrentUser();
    setIsAuthenticated(true);
    setUser(currentUser);
    console.log("👤 User logged in:", currentUser?.name);

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("auth-change"));
  };

  const logout = () => {
    console.log("🚪 Logout called - clearing auth state");
    setIsAuthenticated(false);
    setUser(null);
    authService.logout();

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("auth-change"));
  };

  const updateUser = (updatedUser: User) => {
    console.log("🔄 Updating user data:", updatedUser.name);
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    try {
      console.log("🔄 Refreshing user data from API...");
      const freshUser = await authService.me();
      setUser(freshUser);
      console.log("✅ User data refreshed:", freshUser.name);
    } catch (error) {
      console.error("❌ Failed to refresh user data:", error);
      // If refresh fails, logout
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
