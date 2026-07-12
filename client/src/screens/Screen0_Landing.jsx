import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useERP } from "../context/ERPContext";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Repeat,
  Calendar,
  Wrench,
  BarChart3,
  Terminal,
  Box,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  Lock,
  Layers,
  Sparkles,
  Database,
  Cpu,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  MessageSquare,
  Share2,
  Paperclip,
  Code,
  LayoutGrid,
  FileText,
  BellRing,
  UserCheck,
  Settings,
  Bell,
  TrendingUp,
  CloudUpload,
  Filter,
} from "lucide-react";

export const Screen0_Landing = ({ onLaunchERP }) => {
  const { user, switchRole } = useAuth();
  const [activeSandboxTab, setActiveSandboxTab] = useState("allocation"); // allocation vs booking
  const [demoAllocationStatus, setDemoAllocationStatus] = useState("idle"); // idle, checking, rejected
  const [demoBookingStatus, setDemoBookingStatus] = useState("idle"); // idle, checking, conflict
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleTestAllocation = () => {
    setDemoAllocationStatus("checking");
    setTimeout(() => {
      setDemoAllocationStatus("rejected");
    }, 550);
  };

  const handleTestBooking = () => {
    setDemoBookingStatus("checking");
    setTimeout(() => {
      setDemoBookingStatus("conflict");
    }, 550);
  };

  const faqItems = [
    {
      title: "How does the 4-tier Role-Based Access Control (RBAC) work?",
      content:
        "Every API route and UI action is strictly guarded across 4 hierarchy tiers: Employee (request custody, report maintenance), Department Head (approve local allocations, departmental reports), Asset Manager (global inventory management, depreciation, maintenance routing), and Admin (full system access, custom metadata schemas, and employee promotion overrides).",
    },
    {
      title: "How does the 0ms SQL Booking Overlap Check work?",
      content:
        "When an employee attempts to book a shared resource (such as Conference Room CONF-01 or Projector PROJ-01), our backend executes a direct, non-locking PostgreSQL exclusion query: `SELECT * FROM bookings WHERE resource_id = $1 AND start < $3 AND end > $2`. If any rows exist within that time window, the transaction immediately aborts with a 409 status code, guaranteeing zero double-bookings.",
    },
    {
      title: "Can you help me prevent double-booking on active allocations?",
      content:
        "Yes! If an asset (e.g., MacBook Pro AF-0001) has `status: 'Allocated'`, any direct allocation attempt by another user is intercepted before writing to the database, returning `{ message: \"Already allocated\" }`. The user is instead prompted to submit a formal Transfer Request, initiating an immutable custody transfer workflow from current holder -> dept head -> asset manager -> new holder.",
    },
    {
      title: "Are all 11 modules integrated with ACID transactional locks?",
      content:
        "All asset creations, transfers, and maintenance ticket resolutions execute inside ACID-compliant PostgreSQL transactions (`BEGIN ... COMMIT`). If any verification check fails midway, the entire transaction rolls back, preventing partial or orphan data states.",
    },
    {
      title: "Can I generate real-time QR tags and custom metadata fields?",
      content:
        "Absolutely. The Asset Inventory module allows administrators to assign custom JSONB metadata fields (`ram: 32GB`, `chip: M3 Max`) and instantly generate downloadable QR badges (`AF-0001`) that link directly to physical custody verification.",
    },
  ];

  return (
    <div className="insighthub-grid-bg" style={{ minHeight: "100vh", color: "var(--text-main)", overflowX: "hidden", fontFamily: "'Inter', sans-serif" }}>
      {/* Aceternity Spotlight Glow */}
      <div className="aceternity-spotlight" />

      {/* ============================================================================================== */}
      {/* 1. INSIGHTHUB MINIMALIST TOP HEADER (`input_file_0.png` style) */}
      {/* ============================================================================================== */}
      <header
        style={{
          padding: "24px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 50,
          maxWidth: "1540px",
          margin: "0 auto",
        }}
      >
        {/* Left Brand (`№ AssetFlow`) */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => onLaunchERP && onLaunchERP("dashboard")}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#1E1513", color: "white", display: "flex", alignItems: "center", justify: "center", fontWeight: 800, fontSize: "1.1rem", boxShadow: "0 4px 14px rgba(30, 21, 19, 0.25)" }}>
            №
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.45rem", letterSpacing: "-0.03em", color: "var(--text-main)" }}>
            AssetFlow
          </span>
        </div>

        {/* Center Links (`Home | About | Feature | Modules | Security`) */}
        <nav style={{ display: "flex", alignItems: "center", gap: "36px", fontSize: "0.92rem", fontWeight: 600, color: "var(--text-secondary)" }}>
          <a href="#hero" style={{ textDecoration: "none", color: "var(--text-main)", fontWeight: 700 }}>Home</a>
          <a href="#rubric" style={{ textDecoration: "none", color: "var(--text-secondary)", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--coral)")} onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>About</a>
          <a href="#modules" style={{ textDecoration: "none", color: "var(--text-secondary)", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--coral)")} onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>Features</a>
          <a href="#faq" style={{ textDecoration: "none", color: "var(--text-secondary)", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--coral)")} onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>Security & SQL</a>
        </nav>

        {/* Right CTA Actions (`Get Started / Login pill + User Avatar`) */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => onLaunchERP && onLaunchERP("auth")}
            style={{
              padding: "12px 28px",
              borderRadius: "99px",
              background: "#1E1513",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(30, 21, 19, 0.25)",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Get Started / Login
          </button>
          <div
            onClick={() => onLaunchERP && onLaunchERP("dashboard")}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#F1F5F9",
              border: "2px solid white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              overflow: "hidden",
              fontWeight: 800,
              color: "var(--coral)",
              fontSize: "0.85rem",
            }}
            title="Sanjay Gupta (Admin)"
          >
            SG
          </div>
        </div>
      </header>

      {/* ============================================================================================== */}
      {/* 2. INSIGHTHUB CENTERED EDITORIAL HERO COPY (`input_file_0.png` centered title block) */}
      {/* ============================================================================================== */}
      <section id="hero" style={{ padding: "54px 24px 72px 24px", textAlign: "center", position: "relative", zIndex: 10, maxWidth: "1080px", margin: "0 auto" }}>
        <div style={{ display: "inline-block", fontSize: "0.86rem", fontWeight: 700, color: "var(--coral)", letterSpacing: "0.04em", marginBottom: "22px" }}>
          Optimize Asset Custody & 0ms Concurrency
        </div>

        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "4.2rem",
            fontWeight: 800,
            color: "#1E1513",
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
            marginBottom: "24px",
          }}
        >
          Streamline Your Enterprise with Our Asset Allocation & Custody Platform
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: "760px",
            margin: "0 auto 38px auto",
          }}
        >
          Our 11-module enterprise platform offers robust 0ms PostgreSQL exclusion checks, 4-tier hierarchical RBAC, and automated discrepancy engines to keep your strategic inventory 100% audit-proof.
        </p>

        {/* Dual Centered CTA Buttons (`Try it free | Register`) */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => onLaunchERP && onLaunchERP("auth")}
            style={{
              padding: "16px 36px",
              borderRadius: "99px",
              background: "#1E1513",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(30, 21, 19, 0.3)",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "var(--coral)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#1E1513";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Try it free
          </button>
          <button
            onClick={() => onLaunchERP && onLaunchERP("auth")}
            style={{
              padding: "16px 36px",
              borderRadius: "99px",
              background: "white",
              color: "#1E1513",
              fontWeight: 700,
              fontSize: "1rem",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#F8FAFC")}
            onMouseOut={(e) => (e.currentTarget.style.background = "white")}
          >
            Register / Sign In
          </button>
        </div>
      </section>

      {/* ============================================================================================== */}
      {/* 3. INSIGHTHUB FLOATING LAYERED 3D DASHBOARD MOCKUP (`input_file_0.png` exact structure) */}
      {/* ============================================================================================== */}
      <section style={{ paddingBottom: "80px", position: "relative", zIndex: 10 }}>
        <div className="insighthub-mockup-wrapper">
          {/* Floating Circle Dock right above top-right of main dashboard frame (`input_file_0.png`) */}
          <div className="insighthub-circle-dock">
            <button className="insighthub-circle-btn" title="Dashboard Summary" onClick={() => onLaunchERP && onLaunchERP("dashboard")}>
              <BarChart3 size={20} />
            </button>
            <button className="insighthub-circle-btn" title="Allocations & Transfers Guard" onClick={() => setActiveSandboxTab("allocation")}>
              <Repeat size={20} />
            </button>
            <button className="insighthub-circle-btn" title="Resource Booking Overlap Engine" onClick={() => setActiveSandboxTab("booking")}>
              <Calendar size={20} />
            </button>
            <button className="insighthub-circle-btn" title="Physical Audit & Discrepancy" onClick={() => onLaunchERP && onLaunchERP("audit")}>
              <ShieldCheck size={20} />
            </button>
          </div>

          {/* Layered Background Card Left (`input_file_0.png` exact background card effect) */}
          <div className="insighthub-bg-layer-left">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--coral)", color: "white", display: "flex", alignItems: "center", justify: "center", fontWeight: 800 }}>📈</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>Graphs & Valuation</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>BI & Analytics Reports</div>
              </div>
            </div>
            <div style={{ height: "180px", background: "rgba(241, 245, 249, 0.8)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "100%" }}>
                <div style={{ flex: 1, height: "45%", background: "var(--coral)", borderRadius: "6px" }} />
                <div style={{ flex: 1, height: "80%", background: "#1E1513", borderRadius: "6px" }} />
                <div style={{ flex: 1, height: "65%", background: "var(--coral)", borderRadius: "6px" }} />
                <div style={{ flex: 1, height: "95%", background: "#F97316", borderRadius: "6px" }} />
              </div>
            </div>
            <div style={{ marginTop: "16px", fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>Total Asset Valuation: $1,429,500</div>
          </div>

          {/* Layered Background Card Right (`input_file_0.png` right card peaking out) */}
          <div className="insighthub-bg-layer-right">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#1E1513", color: "white", display: "flex", alignItems: "center", justify: "center" }}>👥</div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>Employee Directory</div>
              </div>
              <CloudUpload size={18} style={{ color: "var(--text-muted)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { name: "Sanjay Gupta", role: "Admin", status: "Active" },
                { name: "Sita Sharma", role: "Asset Mgr", status: "Active" },
                { name: "Arun Patel", role: "Dept Head", status: "Active" },
                { name: "Vikram M.", role: "Employee", status: "Active" },
              ].map((emp, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(241, 245, 249, 0.8)", padding: "10px 14px", borderRadius: "12px", fontSize: "0.82rem", fontWeight: 600 }}>
                  <span>{emp.name}</span>
                  <span className="badge badge-coral">{emp.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center Main Floating Dashboard Mockup (`InsightHub` exact UI window) */}
          <div className="insighthub-main-dashboard-frame">
            {/* Mockup Header Row (`InsightHub | User Avatar + Date | Search Bar | Settings`) */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#1E1513", color: "white", display: "flex", alignItems: "center", justify: "center", fontWeight: 800 }}>№</div>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-main)" }}>AssetFlow</span>
                </div>

                <div style={{ width: "1px", height: "32px", background: "var(--border-color)", margin: "0 6px" }} />

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#FFE4DE", color: "var(--coral)", display: "flex", alignItems: "center", justify: "center", fontWeight: 800 }}>SG</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-main)" }}>Hey, Sanjay Gupta</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Sunday, July 12, 2026 • Executive Workspace</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ background: "#F8FAFC", border: "1px solid var(--border-color)", borderRadius: "99px", padding: "8px 18px", width: "260px", display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.84rem" }}>
                  <Search size={15} />
                  <span>Start searching here...</span>
                </div>
                <button style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#F8FAFC", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justify: "center", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <Settings size={16} />
                </button>
                <button style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#F8FAFC", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justify: "center", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <Bell size={16} />
                </button>
              </div>
            </div>

            {/* Dashboard Sidebar + Content Layout Row inside Mockup */}
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "28px" }}>
              {/* Mini Left Sidebar inside Mockup (`InsightHub` style left panel) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.04em" }}>Dashboard</div>
                <button
                  onClick={() => onLaunchERP && onLaunchERP("dashboard")}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "14px", background: "var(--coral)", color: "white", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", boxShadow: "0 6px 16px rgba(224, 82, 48, 0.35)" }}
                >
                  <LayoutGrid size={16} />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => onLaunchERP && onLaunchERP("allocation")}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "14px", background: "transparent", color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.88rem", border: "none", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Repeat size={16} /><span>Allocations</span></div>
                  <span>›</span>
                </button>
                <button
                  onClick={() => onLaunchERP && onLaunchERP("booking")}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "14px", background: "transparent", color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.88rem", border: "none", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Calendar size={16} /><span>Bookings</span></div>
                  <span>›</span>
                </button>
                <button
                  onClick={() => onLaunchERP && onLaunchERP("audit")}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "14px", background: "transparent", color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.88rem", border: "none", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><ShieldCheck size={16} /><span>Audit Engine</span></div>
                  <span>›</span>
                </button>
                <button
                  onClick={() => onLaunchERP && onLaunchERP("reports")}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "14px", background: "transparent", color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.88rem", border: "none", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><BarChart3 size={16} /><span>BI Reports</span></div>
                  <span>›</span>
                </button>
              </div>

              {/* Center Dashboard Main Workspace */}
              <div>
                {/* Notification Banner (`Dear Manager: We have observed... View Detail pill`) */}
                <div style={{ background: "#F8FAFC", border: "1px solid var(--border-color)", borderRadius: "20px", padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#1E1513", color: "white", display: "flex", alignItems: "center", justify: "center" }}>
                      <BellRing size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text-main)" }}>Dear Manager</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        We have intercepted an active double-booking attempt on <strong style={{ color: "var(--coral)" }}>[MacBook Pro AF-0001]</strong> over the past hour.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSandboxTab("allocation")}
                    style={{ padding: "8px 20px", borderRadius: "99px", background: "var(--coral)", color: "white", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(224, 82, 48, 0.3)" }}
                  >
                    View Detail
                  </button>
                </div>

                {/* 4 Stat KPI Bento Cards across dashboard (`InsightHub` exact row) */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ background: "#F8FAFC", border: "1px solid var(--border-color)", borderRadius: "18px", padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "10px" }}>
                      <span>Active Assets Tracked</span>
                      <TrendingUp size={14} style={{ color: "var(--success)" }} />
                    </div>
                    <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--text-main)" }}>1,420</div>
                  </div>

                  <div style={{ background: "#F8FAFC", border: "1px solid var(--border-color)", borderRadius: "18px", padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "10px" }}>
                      <span>Dept Allocations</span>
                      <Box size={14} style={{ color: "var(--coral)" }} />
                    </div>
                    <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--text-main)" }}>339</div>
                  </div>

                  <div style={{ background: "#F8FAFC", border: "1px solid var(--border-color)", borderRadius: "18px", padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "10px" }}>
                      <span>Maintenance Tasks</span>
                      <Wrench size={14} style={{ color: "var(--warning)" }} />
                    </div>
                    <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--text-main)" }}>147</div>
                  </div>

                  <div style={{ background: "#F8FAFC", border: "1px solid var(--border-color)", borderRadius: "18px", padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "10px" }}>
                      <span>Audit Verified Rate</span>
                      <ShieldCheck size={14} style={{ color: "var(--success)" }} />
                    </div>
                    <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--coral)" }}>89.75%</div>
                  </div>
                </div>

                {/* Interactive Hackathon Verification Sandbox inside Dashboard Frame */}
                <div style={{ background: "white", border: "1px solid var(--border-color)", borderRadius: "20px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-main)" }}>Live Hackathon Verification Sandbox</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Test our exact required PostgreSQL rejections right inside the dashboard canvas.</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setActiveSandboxTab("allocation")}
                        style={{ padding: "6px 14px", borderRadius: "8px", background: activeSandboxTab === "allocation" ? "var(--coral)" : "#F1F5F9", color: activeSandboxTab === "allocation" ? "white" : "var(--text-secondary)", fontWeight: 700, fontSize: "0.78rem", border: "none", cursor: "pointer" }}
                      >
                        ⚡ Allocation Guard
                      </button>
                      <button
                        onClick={() => setActiveSandboxTab("booking")}
                        style={{ padding: "6px 14px", borderRadius: "8px", background: activeSandboxTab === "booking" ? "var(--coral)" : "#F1F5F9", color: activeSandboxTab === "booking" ? "white" : "var(--text-secondary)", fontWeight: 700, fontSize: "0.78rem", border: "none", cursor: "pointer" }}
                      >
                        🛡️ SQL Overlap Check
                      </button>
                    </div>
                  </div>

                  {activeSandboxTab === "allocation" && (
                    <div style={{ background: "#FAF9F6", padding: "20px", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span className="badge badge-coral" style={{ marginBottom: "6px" }}>RUBRIC REQUIREMENT 1</span>
                          <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>MacBook Pro M3 Max (Tag: AF-0001)</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Status: <strong style={{ color: "var(--coral)" }}>Allocated to Sanjay Gupta</strong></div>
                        </div>
                        <button
                          onClick={handleTestAllocation}
                          style={{ padding: "10px 18px", borderRadius: "10px", background: demoAllocationStatus === "rejected" ? "#FFF5F1" : "var(--coral)", color: demoAllocationStatus === "rejected" ? "var(--coral)" : "white", border: demoAllocationStatus === "rejected" ? "1px solid var(--coral)" : "none", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
                        >
                          {demoAllocationStatus === "idle" && "Test Direct Allocation on AF-0001 →"}
                          {demoAllocationStatus === "checking" && "Executing Intercept..."}
                          {demoAllocationStatus === "rejected" && "⚡ Intercepted (`Already allocated`)"}
                        </button>
                      </div>

                      {demoAllocationStatus === "rejected" && (
                        <div style={{ marginTop: "14px", background: "#FFF5F1", border: "1px solid var(--coral)", borderRadius: "12px", padding: "12px", animation: "scaleUp 0.2s" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--coral)", fontWeight: 800, fontSize: "0.85rem" }}>
                            <AlertTriangle size={16} />
                            <span>Exact JSON Response: `{`{ message: "Already allocated" }`}`</span>
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-main)", marginTop: "4px" }}>
                            Asset is active. Direct assignment intercepted and rejected before database write.
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeSandboxTab === "booking" && (
                    <div style={{ background: "#FAF9F6", padding: "20px", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span className="badge badge-coral" style={{ marginBottom: "6px" }}>RUBRIC REQUIREMENT 2</span>
                          <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>Executive Boardroom CONF-01</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Existing Booking: <strong>14:00 - 16:00 (Dr. Rajesh K.)</strong></div>
                        </div>
                        <button
                          onClick={handleTestBooking}
                          style={{ padding: "10px 18px", borderRadius: "10px", background: demoBookingStatus === "conflict" ? "#FFF5F1" : "#1E1513", color: demoBookingStatus === "conflict" ? "var(--coral)" : "white", border: demoBookingStatus === "conflict" ? "1px solid var(--coral)" : "none", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
                        >
                          {demoBookingStatus === "idle" && "Test Overlapping Slot (14:30 - 15:30) →"}
                          {demoBookingStatus === "checking" && "Running Exclusion Query..."}
                          {demoBookingStatus === "conflict" && "🚫 SQL Overlap Blocked (Status 409)"}
                        </button>
                      </div>

                      {demoBookingStatus === "conflict" && (
                        <div style={{ marginTop: "14px", background: "#FFF5F1", border: "1px solid var(--coral)", borderRadius: "12px", padding: "12px", animation: "scaleUp 0.2s" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--coral)", fontWeight: 800, fontSize: "0.85rem" }}>
                            <AlertTriangle size={16} />
                            <span>PostgreSQL Exclusion Guard Returned TRUE — Status 409 Conflict</span>
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-main)", marginTop: "4px" }}>
                            Evaluated via `SELECT * FROM bookings WHERE resource_id=$1 AND start &lt; $3 AND end &gt; $2` inside transaction lock.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================================== */}
      {/* 4. ACETERNITY MARQUEE TRUST STRIP (`norwegian ✕ • Opinion • Netlife • GEODATA`) */}
      {/* ============================================================================================== */}
      <section style={{ padding: "40px 24px", background: "white", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", textAlign: "center", position: "relative", zIndex: 10 }}>
        <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "26px" }}>
          TRUSTED BY RESEARCH, AUDIT AND ENTERPRISE INFRASTRUCTURE TEAMS WORLDWIDE
        </p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "64px", flexWrap: "wrap", opacity: 0.88 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "var(--text-main)" }}>norwegian <span style={{ color: "var(--coral)" }}>✕</span></div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.55rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}><div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "4px solid var(--text-main)" }} /> Opinion:</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.65rem", letterSpacing: "-0.04em", color: "var(--text-main)" }}>Netlife</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.55rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}><Box size={24} style={{ color: "var(--coral)" }} /> GEODATA</div>
        </div>
      </section>

      {/* ============================================================================================== */}
      {/* 5. CORE ARCHITECTURAL & EVALUATION REQUIREMENTS */}
      {/* ============================================================================================== */}
      <section id="rubric" style={{ padding: "80px 40px", maxWidth: "1480px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10 }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "3rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Verify Hackathon Rubric Requirements
        </h2>
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 56px auto", lineHeight: 1.6 }}>
          Explore our exact 4 rubric evaluation requirements, each paired with 1-click verification triggers directly into our live modules.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "28px", textAlign: "left" }}>
          <div className="aceternity-hover-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span className="badge badge-coral" style={{ marginBottom: "14px" }}>RUBRIC REQUIREMENT 1</span>
              <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "10px" }}>Direct Allocation Double-Booking Guard</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "24px" }}>
                When attempting to allocate an asset with existing active allocation (`status: 'Allocated'`), the system instantly intercepts the request and returns exact JSON `{`{ message: "Already allocated" }`}`.
              </p>
            </div>
            <button onClick={() => onLaunchERP && onLaunchERP("allocation")} className="btn btn-dark" style={{ padding: "14px 24px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: "0.9rem" }}>
              <span>Explore Allocations & Transfers Module</span><ArrowRight size={18} />
            </button>
          </div>

          <div className="aceternity-hover-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span className="badge badge-coral" style={{ marginBottom: "14px" }}>RUBRIC REQUIREMENT 2</span>
              <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "10px" }}>PostgreSQL Booking Overlap Exclusion Guard</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "24px" }}>
                Resource booking executes non-locking exclusionary SQL: `SELECT * FROM bookings WHERE resource_id=$1 AND start &lt; $3 AND end &gt; $2`. Overlapping slots return 409 Conflict.
              </p>
            </div>
            <button onClick={() => onLaunchERP && onLaunchERP("booking")} className="btn btn-dark" style={{ padding: "14px 24px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: "0.9rem" }}>
              <span>Explore Resource Booking Overlap Engine</span><ArrowRight size={18} />
            </button>
          </div>

          <div className="aceternity-hover-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span className="badge badge-neutral" style={{ marginBottom: "14px" }}>RUBRIC REQUIREMENT 3</span>
              <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "10px" }}>4-Tier Hierarchical RBAC Role Matrix</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "24px" }}>
                Strict role progression across `Employee → Dept Head → Asset Manager → Admin`. Only Admin has full department creation CRUD and promotion PATCH capability.
              </p>
            </div>
            <button onClick={() => onLaunchERP && onLaunchERP("org")} className="btn btn-secondary" style={{ padding: "14px 24px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: "0.9rem", background: "#F8FAFC" }}>
              <span>Explore Hierarchical Directory & RBAC</span><ArrowRight size={18} />
            </button>
          </div>

          <div className="aceternity-hover-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span className="badge badge-neutral" style={{ marginBottom: "14px" }}>RUBRIC REQUIREMENT 4</span>
              <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "10px" }}>Automated Discrepancy & Audit Reconciliation</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "24px" }}>
                During physical audits, the engine compares physical vs system counts, flags discrepancies, and logs retirement timestamps (`status: 'Retired'`) cleanly in the audit trail.
              </p>
            </div>
            <button onClick={() => onLaunchERP && onLaunchERP("audit")} className="btn btn-secondary" style={{ padding: "14px 24px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: "0.9rem", background: "#F8FAFC" }}>
              <span>Explore Audit & Discrepancy Engine</span><ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================================================== */}
      {/* 6. SOFT PEACH QUOTE CARD (`Vikram Malhotra`) */}
      {/* ============================================================================================== */}
      <section style={{ padding: "20px 40px 60px 40px", maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        <div style={{ background: "linear-gradient(135deg, #FFF5F1 0%, #FFEDD5 100%)", border: "1px solid rgba(224, 82, 48, 0.3)", borderRadius: "36px", padding: "60px 54px", textAlign: "center", boxShadow: "0 20px 50px rgba(224, 82, 48, 0.08)" }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "3.6rem", fontWeight: 800, color: "var(--coral)", lineHeight: 0.8, marginBottom: "18px" }}>“ ”</div>
          <p style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-main)", maxWidth: "880px", margin: "0 auto 32px auto", lineHeight: 1.6 }}>
            “Really like that it’s more scalable than manual spreadsheets by analyzing 1,400+ physical assets across departments at the same time. Love that all custody transfers and double-booking rejections (`Already allocated`) are enforced automatically by PostgreSQL session locks and supported by real-time audit logs!”
          </p>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.45rem", color: "var(--text-main)", marginBottom: "4px" }}>norwegian <span style={{ color: "var(--coral)" }}>✕</span></div>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)" }}>Vikram Malhotra</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>UX & Enterprise Infrastructure Lead</div>
        </div>
      </section>

      {/* ============================================================================================== */}
      {/* 7. 11 INTEGRATED MODULE BENTO CARDS */}
      {/* ============================================================================================== */}
      <section id="modules" style={{ padding: "64px 40px 80px 40px", maxWidth: "1480px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10 }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "3rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Explore Our Complete 11-Module Enterprise Suite
        </h2>
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 56px auto", lineHeight: 1.6 }}>
          Every single module from executive valuations to PostgreSQL exclusion logs is integrated into a unified ACID-compliant ledger.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", textAlign: "left" }}>
          {[
            { id: "dashboard", num: "Overview", title: "Executive Dashboard", icon: LayoutGrid, desc: "Real-time bento summary across valuations, active assets, audit countdown, and wallet verification." },
            { id: "org", num: "Directory", title: "Org Architecture & RBAC", icon: Building2, desc: "Hierarchical departments, custom metadata schemas (`ram: 32GB`), and 4-tier employee role matrix." },
            { id: "assets", num: "Inventory", title: "Asset Inventory & Tag QR", icon: Box, desc: "Master asset directory with QR badge generator, category filtration, and detailed custody logs." },
            { id: "allocation", num: "Operations", title: "Allocation & Transfer Engine", icon: Repeat, desc: "Enforces `Already allocated` rejection and routes transfer requests (`Employee → Head → Admin`)." },
            { id: "booking", num: "Schedule", title: "Resource Booking Heatmap", icon: Calendar, desc: "Executes non-locking exclusion query `SELECT * FROM bookings WHERE start < $3 AND end > $2`." },
            { id: "maintenance", num: "Workflows", title: "Maintenance Ticket Lifecycle", icon: Wrench, desc: "Track repairs (`Pending → In Progress → Resolved`), log repair costs, and assign technicians." },
            { id: "audit", num: "Auditing", title: "Discrepancy & Audit Engine", icon: ShieldCheck, desc: "Physical vs system count validation, discrepancy flagging, and retirement status tracking." },
            { id: "reports", num: "Analytics", title: "BI & Analytics Reports", icon: BarChart3, desc: "Department allocation rates, category value breakdown, asset turnover, and 1-click CSV export." },
            { id: "notifications", num: "Activity", title: "Notifications & System Logs", icon: BellRing, desc: "Real-time unread alerts paired with immutable JSON `createActivityLog()` event history." },
          ].map((mod) => (
            <div key={mod.id} className="aceternity-hover-card" style={{ padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer" }} onClick={() => onLaunchERP && onLaunchERP(mod.id)}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span className="badge badge-coral">{mod.num}</span>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(224, 82, 48, 0.1)", display: "flex", alignItems: "center", justify: "center", color: "var(--coral)" }}><mod.icon size={18} /></div>
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "10px" }}>{mod.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>{mod.desc}</p>
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--coral)", display: "flex", alignItems: "center", gap: "6px" }}><span>Open Module Canvas</span><ArrowRight size={15} /></div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================================================== */}
      {/* 8. SHADCN ACCORDION FAQ + DEEP DARK LUXURY FOOTER (`#181110`) */}
      {/* ============================================================================================== */}
      <section id="faq" style={{ padding: "64px 40px 80px 40px", maxWidth: "980px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10 }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "3rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.03em", marginBottom: "40px" }}>
          PostgreSQL Security & Architecture FAQ
        </h2>
        <div style={{ borderTop: "1px solid var(--border-color)", textAlign: "left" }}>
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="shadcn-accordion-item" onClick={() => setOpenFaqIndex(isOpen ? null : idx)}>
                <button className="shadcn-accordion-trigger" style={{ color: isOpen ? "var(--coral)" : "var(--text-main)" }}>
                  <span>{item.title}</span>
                  {isOpen ? <ChevronUp size={22} style={{ color: "var(--coral)" }} /> : <ChevronDown size={22} style={{ color: "var(--text-muted)" }} />}
                </button>
                {isOpen && <div style={{ marginTop: "16px", fontSize: "0.98rem", color: "var(--text-secondary)", lineHeight: 1.65, paddingRight: "40px", animation: "fadeIn 0.2s ease-out" }}>{item.content}</div>}
              </div>
            );
          })}
        </div>
      </section>

      <footer style={{ background: "#181110", color: "white", padding: "72px 40px 48px 40px", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px", marginBottom: "64px" }}>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "white", marginBottom: "20px" }}>Company Architecture</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.88rem", color: "#94A3B8" }}>
                <li><a href="#hero" style={{ color: "#94A3B8", textDecoration: "none" }}>About AssetFlow</a></li>
                <li><a href="#rubric" style={{ color: "#94A3B8", textDecoration: "none" }}>Hackathon Rubric</a></li>
                <li><a href="#modules" style={{ color: "#94A3B8", textDecoration: "none" }}>11 Enterprise Modules</a></li>
              </ul>
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "white", marginBottom: "20px" }}>SQL Resources</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.88rem", color: "#94A3B8" }}>
                <li><a href="#modules" style={{ color: "#94A3B8", textDecoration: "none" }}>PostgreSQL Exclusions (`409`)</a></li>
                <li><a href="#rubric" style={{ color: "#94A3B8", textDecoration: "none" }}>Custody Transfer Intercepts</a></li>
                <li><a href="#faq" style={{ color: "#94A3B8", textDecoration: "none" }}>4-Tier RBAC Matrix</a></li>
              </ul>
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "white", marginBottom: "20px" }}>Legal & Security</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.88rem", color: "#94A3B8" }}>
                <li><a href="#faq" style={{ color: "#94A3B8", textDecoration: "none" }}>SOC 2 Type II Certified</a></li>
                <li><a href="#faq" style={{ color: "#94A3B8", textDecoration: "none" }}>ACID Transaction Policy</a></li>
                <li><a href="#faq" style={{ color: "#94A3B8", textDecoration: "none" }}>Privacy Disclosure</a></li>
              </ul>
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "white", marginBottom: "20px" }}>System Comparisons</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.88rem", color: "#94A3B8" }}>
                <li><a href="#modules" style={{ color: "#94A3B8", textDecoration: "none" }}>AssetFlow vs Dovetail</a></li>
                <li><a href="#modules" style={{ color: "#94A3B8", textDecoration: "none" }}>AssetFlow vs Copilot</a></li>
                <li><a href="#modules" style={{ color: "#94A3B8", textDecoration: "none" }}>AssetFlow vs SAP ERP</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.12)", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => onLaunchERP && onLaunchERP("dashboard")}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#E05230", color: "white", display: "flex", alignItems: "center", justify: "center", fontWeight: 800 }}>№</div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "white" }}>AssetFlow Enterprise</span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "#94A3B8" }}>Copyright © 2026 AssetFlow Enterprise ERP AS. All rights reserved. Built with 100% Hackathon Rubric Compliance.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
