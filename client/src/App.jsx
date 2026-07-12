import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ERPProvider } from "./context/ERPContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

// Landing Page + 10 ERP Screens
import { Screen0_Landing } from "./screens/Screen0_Landing";
import { Screen1_Auth } from "./screens/Screen1_Auth";
import { Screen2_Dashboard } from "./screens/Screen2_Dashboard";
import { Screen3_OrgSetup } from "./screens/Screen3_OrgSetup";
import { Screen4_Assets } from "./screens/Screen4_Assets";
import { Screen5_Allocation } from "./screens/Screen5_Allocation";
import { Screen6_Booking } from "./screens/Screen6_Booking";
import { Screen7_Maintenance } from "./screens/Screen7_Maintenance";
import { Screen8_Audit } from "./screens/Screen8_Audit";
import { Screen9_Reports } from "./screens/Screen9_Reports";
import { Screen10_Notifications } from "./screens/Screen10_Notifications";

const getRouteStateFromPath = (path = "") => {
  const p = (path || window.location.pathname || "/").toLowerCase();
  if (p === "/login" || p === "/signup" || p === "/auth") {
    return { showLanding: false, activeTab: "auth" };
  }
  const erpRoutes = ["dashboard", "org", "assets", "allocation", "booking", "maintenance", "audit", "reports", "notifications"];
  const found = erpRoutes.find((r) => p === `/${r}`);
  if (found) {
    return { showLanding: false, activeTab: found };
  }
  return { showLanding: true, activeTab: "dashboard" };
};

function MainERPContent() {
  const { user } = useAuth();
  const initialRoute = getRouteStateFromPath();
  const [activeTab, setActiveTab] = useState(initialRoute.activeTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showLanding, setShowLanding] = useState(initialRoute.showLanding);

  // Sync browser address bar URL with current screen
  useEffect(() => {
    let targetPath = "/";
    if (!showLanding) {
      if (activeTab === "auth") targetPath = "/login";
      else targetPath = `/${activeTab}`;
    }
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, [activeTab, showLanding]);

  // Handle browser Back / Forward popstate navigation
  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = getRouteStateFromPath(window.location.pathname);
      setShowLanding(nextRoute.showLanding);
      setActiveTab(nextRoute.activeTab);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleLaunchERP = (tabId = "dashboard") => {
    if (tabId === "home") {
      setShowLanding(true);
      return;
    }
    setActiveTab(tabId);
    setShowLanding(false);
  };

  // If showing landing page
  if (showLanding) {
    return <Screen0_Landing onLaunchERP={handleLaunchERP} />;
  }

  // If not logged in or viewing Authentication / Signin / Signup screen (`/login`, `/signup`)
  if (!user || activeTab === "auth") {
    return <Screen1_Auth onLaunchERP={handleLaunchERP} setShowLanding={setShowLanding} />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "dashboard":
        return <Screen2_Dashboard setActiveTab={setActiveTab} />;
      case "org":
        return <Screen3_OrgSetup />;
      case "assets":
        return <Screen4_Assets />;
      case "allocation":
        return <Screen5_Allocation />;
      case "booking":
        return <Screen6_Booking />;
      case "maintenance":
        return <Screen7_Maintenance />;
      case "audit":
        return <Screen8_Audit />;
      case "reports":
        return <Screen9_Reports />;
      case "notifications":
        return <Screen10_Notifications />;
      default:
        return <Screen2_Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarCollapsed={sidebarCollapsed}
      />
      <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          setShowLanding={setShowLanding}
        />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ERPProvider>
        <MainERPContent />
      </ERPProvider>
    </AuthProvider>
  );
}

export default App;
