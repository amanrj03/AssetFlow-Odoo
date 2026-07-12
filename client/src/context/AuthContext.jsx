import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

const INITIAL_DEMO_USERS = {
  ADMIN: {
    id: "usr-admin-01",
    name: "Vikram Malhotra",
    email: "admin@assetflow.com",
    role: "ADMIN",
    department: "Executive & Admin",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    permissions: ["FULL_ACCESS"],
  },
  ASSET_MANAGER: {
    id: "usr-am-02",
    name: "Priya Sharma",
    email: "manager@assetflow.com",
    role: "ASSET_MANAGER",
    department: "Logistics & Procurement",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    permissions: ["CRUD_ASSETS", "APPROVE_ALLOCATIONS", "MANAGE_MAINTENANCE"],
  },
  DEPARTMENT_HEAD: {
    id: "usr-dh-03",
    name: "Dr. Rajesh K.",
    email: "head@assetflow.com",
    role: "DEPARTMENT_HEAD",
    department: "R&D & Engineering",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    permissions: ["VIEW_ASSETS", "APPROVE_DEPT_ALLOCATIONS", "MANAGE_BOOKINGS"],
  },
  EMPLOYEE: {
    id: "usr-emp-04",
    name: "Aman Verma",
    email: "employee@assetflow.com",
    role: "EMPLOYEE",
    department: "R&D & Engineering",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    permissions: ["VIEW_SELF", "REQUEST_ALLOCATIONS", "BOOK_RESOURCES", "RAISE_MAINTENANCE"],
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("assetflow_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("assetflow_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("assetflow_token");
      if (savedToken) {
        api.setToken(savedToken);
        try {
          const res = await api.getMe();
          if (res && res.success && res.data) {
            setUser(res.data.user || res.data);
          } else {
            setUser(null);
            api.setToken(null);
          }
        } catch (error) {
          console.error("Session restore failed:", error);
          setUser(null);
          api.setToken(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res && res.success && res.data) {
        const token = res.data.token;
        const loggedInUser = res.data.user || res.data;
        localStorage.setItem("assetflow_token", token);
        api.setToken(token);
        setUser(loggedInUser);
        return { success: true };
      }
      return { success: false, message: res.message || "Login failed" };
    } catch (err) {
      console.error("Login API call failed:", err);
      return { success: false, message: err.message || "Network error" };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const employeeCode = "EMP" + Math.floor(1000 + Math.random() * 9000);
      const res = await api.signup({ name, email, password, employeeCode });
      if (res && res.success && res.data) {
        const token = res.data.token;
        const loggedInUser = res.data.user || res.data;
        localStorage.setItem("assetflow_token", token);
        api.setToken(token);
        setUser(loggedInUser);
        return { success: true };
      }
      return { success: false, message: res.message || "Signup failed" };
    } catch (err) {
      console.error("Signup API call failed:", err);
      return { success: false, message: err.message || "Network error" };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem("assetflow_token");
    setUser(null);
    api.setToken(null);
  };

  const switchRole = async (roleKey) => {
    const emails = {
      ADMIN: "admin@assetflow.com",
      ASSET_MANAGER: "manager@assetflow.com",
      DEPARTMENT_HEAD: "head@assetflow.com",
      EMPLOYEE: "employee@assetflow.com",
    };
    const email = emails[roleKey];
    if (email) {
      return await login(email, "password123");
    }
  };

  const continueAsGuest = async () => {
    return await login("admin@assetflow.com", "password123");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        signup,
        logout,
        switchRole,
        continueAsGuest,
        demoMode: false,
        theme,
        toggleTheme,
        demoUsersList: INITIAL_DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
