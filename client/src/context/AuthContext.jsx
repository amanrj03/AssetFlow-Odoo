import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

const INITIAL_DEMO_USERS = {
  ADMIN: {
    id: "usr-admin-01",
    name: "Vikram Malhotra",
    email: "admin@assetflow.enterprise",
    role: "ADMIN",
    department: "Executive & Admin",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    permissions: ["FULL_ACCESS"],
  },
  ASSET_MANAGER: {
    id: "usr-am-02",
    name: "Priya Sharma",
    email: "priya.asset@assetflow.enterprise",
    role: "ASSET_MANAGER",
    department: "Logistics & Procurement",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    permissions: ["CRUD_ASSETS", "APPROVE_ALLOCATIONS", "MANAGE_MAINTENANCE"],
  },
  DEPARTMENT_HEAD: {
    id: "usr-dh-03",
    name: "Dr. Rajesh K.",
    email: "rajesh.head@assetflow.enterprise",
    role: "DEPARTMENT_HEAD",
    department: "R&D & Engineering",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    permissions: ["VIEW_ASSETS", "APPROVE_DEPT_ALLOCATIONS", "MANAGE_BOOKINGS"],
  },
  EMPLOYEE: {
    id: "usr-emp-04",
    name: "Aman Verma",
    email: "aman@assetflow.enterprise",
    role: "EMPLOYEE",
    department: "R&D & Engineering",
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    permissions: ["VIEW_SELF", "REQUEST_ALLOCATIONS", "BOOK_RESOURCES", "RAISE_MAINTENANCE"],
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("assetflow_current_user");
    return saved ? JSON.parse(saved) : INITIAL_DEMO_USERS.ADMIN;
  });

  const [demoMode, setDemoMode] = useState(() => {
    const saved = localStorage.getItem("assetflow_demo_mode");
    return saved !== null ? JSON.parse(saved) : true;
  });

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
    if (user) {
      localStorage.setItem("assetflow_current_user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("assetflow_demo_mode", JSON.stringify(demoMode));
  }, [demoMode]);

  const login = async (email, password) => {
    if (!demoMode) {
      try {
        const res = await api.login({ email, password });
        if (res && res.user) {
          setUser(res.user);
          return { success: true };
        }
      } catch (err) {
        console.warn("Backend API login failed, falling back to Demo Simulation if matching:", err);
      }
    }

    // Demo / Simulation Login Check
    const foundRole = Object.keys(INITIAL_DEMO_USERS).find(
      (role) => INITIAL_DEMO_USERS[role].email.toLowerCase() === email.toLowerCase()
    );
    if (foundRole) {
      setUser(INITIAL_DEMO_USERS[foundRole]);
      return { success: true };
    }

    // Default to Employee or Admin
    if (email.includes("admin")) {
      setUser(INITIAL_DEMO_USERS.ADMIN);
    } else if (email.includes("manager")) {
      setUser(INITIAL_DEMO_USERS.ASSET_MANAGER);
    } else if (email.includes("head")) {
      setUser(INITIAL_DEMO_USERS.DEPARTMENT_HEAD);
    } else {
      setUser({
        id: "usr-" + Date.now(),
        name: email.split("@")[0] || "Employee User",
        email: email,
        role: "EMPLOYEE",
        department: "General Operations",
        status: "ACTIVE",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        permissions: ["VIEW_SELF", "REQUEST_ALLOCATIONS", "BOOK_RESOURCES", "RAISE_MAINTENANCE"],
      });
    }
    return { success: true };
  };

  const signup = async (name, email, password) => {
    if (!demoMode) {
      try {
        const res = await api.signup({ name, email, password });
        if (res && res.user) {
          setUser(res.user);
          return { success: true };
        }
      } catch (err) {
        console.warn("Backend API signup failed, using simulation:", err);
      }
    }

    // Always create EMPLOYEE role as per specifications: "Signup always creates: EMPLOYEE. Only Admin promotes users."
    const newEmp = {
      id: "usr-" + Math.floor(1000 + Math.random() * 9000),
      name,
      email,
      role: "EMPLOYEE",
      department: "General Operations",
      status: "ACTIVE",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      permissions: ["VIEW_SELF", "REQUEST_ALLOCATIONS", "BOOK_RESOURCES", "RAISE_MAINTENANCE"],
    };
    setUser(newEmp);
    return { success: true };
  };

  const logout = async () => {
    if (!demoMode) {
      try {
        await api.logout();
      } catch (e) {
        /* ignore */
      }
    }
    setUser(null);
  };

  const switchRole = (roleKey) => {
    if (INITIAL_DEMO_USERS[roleKey]) {
      setUser(INITIAL_DEMO_USERS[roleKey]);
    } else {
      setUser((prev) => ({ ...prev, role: roleKey }));
    }
  };

  const continueAsGuest = () => {
    const guestUser = {
      ...INITIAL_DEMO_USERS.ADMIN,
      name: "Guest Admin (Demo)",
      email: "guest@assetflow.enterprise",
    };
    setUser(guestUser);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        signup,
        logout,
        switchRole,
        continueAsGuest,
        demoMode,
        setDemoMode,
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
