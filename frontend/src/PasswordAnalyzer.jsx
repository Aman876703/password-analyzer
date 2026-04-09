import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale);

// 🔥 1. HIGH-TECH CANVAS BACKGROUND
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(16, 185, 129, 0.3)";
        ctx.fill();
      }
    }

    for (let i = 0; i < 40; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance / 150})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.6,
      }}
    />
  );
};

const PasswordAnalyzer = () => {
  // 🛑 LOGIC REMAINS 100% UNTOUCHED 🛑
  const [password, setPassword] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getColor = (score) => {
    if (score < 35) return "#ff4d4f";
    if (score < 70) return "#facc15";
    return "#22c55e";
  };

  const getLabel = (score) => {
    if (score < 35) return "Weak";
    if (score < 70) return "Medium";
    return "Strong";
  };

  const calculateScore = (password) => {
    let score = 0;
    if (!password) return 0;
    score += Math.min(password.length * 4, 40);
    if (/[A-Z]/.test(password)) score += 10;
    if (/[a-z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;
    return Math.min(score, 100);
  };

  const handleChange = async (e) => {
    const pwd = e.target.value;
    setPassword(pwd);

    if (!pwd) {
      setAnalysis(null);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ password: pwd }),
      });

      const data = await res.json();
      console.log("API:", data);
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    }
  };

  const copyPassword = (pwd) => {
    navigator.clipboard.writeText(pwd);
  };
  // 🛑 END OF LOGIC 🛑

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ParticleBackground />
      <div style={{
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        background: "linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        zIndex: 0,
        pointerEvents: "none",
      }}></div>

      <style>
        {`
          .glass-panel {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
          }
          
          .glass-panel:hover {
            box-shadow: 0 10px 25px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.03);
            border-color: rgba(255,255,255,0.08);
          }

          @keyframes scanLine {
            0% { top: -10%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 110%; opacity: 0; }
          }
          .glass-panel::after {
            content: '';
            position: absolute;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), transparent);
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
            animation: scanLine 4s infinite linear;
            pointer-events: none;
            z-index: 20;
            display: none; 
          }
          .scanning-active::after {
            display: block;
          }

          .metric-card {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.03);
            border-radius: 10px;
            padding: 12px 15px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            transition: all 0.3s ease;
          }
          .metric-card:hover {
            background: rgba(255,255,255,0.02);
            border-color: rgba(0, 240, 255, 0.2);
            box-shadow: 0 5px 15px rgba(0, 240, 255, 0.05);
          }

          .input-container {
            transition: all 0.3s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.6);
            position: relative;
          }
          .input-container:focus-within {
            box-shadow: 0 0 25px rgba(0, 240, 255, 0.15), 0 5px 20px rgba(0,0,0,0.6);
            transform: scale(1.005);
            border-color: rgba(0, 240, 255, 0.4) !important;
          }
          .custom-input:focus {
            background: transparent !important;
            color: #00f0ff !important;
            box-shadow: none !important;
            outline: none !important;
          }

          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .stagger-1 { animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .stagger-2 { animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards; opacity: 0; }
          .stagger-3 { animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }

          @keyframes textSweep {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-title {
            background: linear-gradient(90deg, #fff, #94a3b8, #00f0ff, #fff);
            background-size: 300% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: textSweep 6s linear infinite;
          }

          @keyframes pulseDial {
            0% { box-shadow: 0 0 0 0 rgba(var(--dial-color), 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(var(--dial-color), 0); }
            100% { box-shadow: 0 0 0 0 rgba(var(--dial-color), 0); }
          }
          .score-dial {
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .score-dial.active {
            animation: pulseDial 2s infinite;
          }
          
          @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
          .standby-icon {
            animation: floating 3s ease-in-out infinite;
          }

          .copy-btn {
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
          }
          .copy-btn:hover {
            transform: scale(1.05) translateY(-1px);
            box-shadow: 0 4px 10px rgba(34, 197, 94, 0.2);
            color: #fff !important;
            background: #22c55e !important;
          }
        `}
      </style>

      {/* 🚀 NAVBAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 3%",
          background: "rgba(2, 6, 23, 0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={() => navigate("/main")}
            className="back-btn"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#e2e8f0",
              padding: "6px 12px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(0, 240, 255, 0.1)"; e.currentTarget.style.color = "#00f0ff"; e.currentTarget.style.borderColor = "rgba(0, 240, 255, 0.3)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#e2e8f0"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            <span>←</span> Back
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>⚡</span>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "-0.5px" }}>
              PasswordGuard
            </h2>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {user && <span style={{ color: "#94a3b8", fontWeight: "500", fontSize: "14px", display: { xs: 'none', md: 'block' } }}>Hello, {user.name}</span>}
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255, 77, 79, 0.05)",
              border: "1px solid rgba(255, 77, 79, 0.3)",
              color: "#ff4d4f",
              padding: "6px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "bold",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => { e.target.style.background = "#ff4d4f"; e.target.style.color = "white"; e.target.style.boxShadow = "0 0 10px rgba(255,77,79,0.4)"; }}
            onMouseOut={(e) => { e.target.style.background = "rgba(255, 77, 79, 0.05)"; e.target.style.color = "#ff4d4f"; e.target.style.boxShadow = "none"; }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🌟 MAIN SCANNED CONTAINER */}
      <div style={{ display: "flex", justifyContent: "center", padding: "15px 20px", position: "relative", zIndex: 10, flex: 1 }}>
        <div style={{ width: "100%", maxWidth: "1300px" }}>
          
          <div className="stagger-1" style={{ textAlign: "center", marginBottom: "15px" }}>
            <h2 className="animated-title" style={{ fontWeight: "900", fontSize: "2rem", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>
              Deep Security Scan
            </h2>
            <p style={{ color: "#475569", fontSize: "0.9rem", marginTop: "5px", marginBottom: "0", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>System initialized. Awaiting user input.</p>
          </div>

          {/* 🔥 INPUT AREA */}
          <div className="input-group mb-3 input-container stagger-1" style={{ height: "55px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${analysis ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`, background: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "0 20px", background: "rgba(0,0,0,0.5)", color: analysis ? "#00f0ff" : "#475569", borderRight: `1px solid ${analysis ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'}`, transition: "color 0.3s ease" }}>
              <span style={{ fontSize: "20px" }}>{analysis ? "🔓" : "🔒"}</span>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control custom-input"
              value={password}
              onChange={handleChange}
              placeholder="Enter target password sequence..."
              style={{
                background: "transparent",
                color: "#00f0ff",
                border: "none",
                fontSize: "18px",
                paddingLeft: "15px",
                letterSpacing: showPassword ? "normal" : "4px",
                fontWeight: "600",
              }}
            />
            <button
              className="btn"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "transparent",
                border: "none",
                borderLeft: `1px solid ${analysis ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'}`,
                width: "60px",
                fontSize: "20px",
                color: analysis ? "#00f0ff" : "#475569",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = analysis ? "rgba(0, 240, 255, 0.05)" : "rgba(255,255,255,0.02)"}
              onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* 🔥 DENSE RESULTS GRID */}
          <div>
            {/* TOP ROW */}
            <div className="row g-3 mb-3">
              
              {/* SCORE WIDGET */}
              <div className="col-lg-3 col-md-4">
                <div className={`glass-panel stagger-2 ${analysis ? 'scanning-active' : ''}`} style={{ height: "100%", padding: "15px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "160px" }}>
                  <div
                    className={`score-dial ${analysis ? 'active' : ''}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      margin: "0 auto 10px auto",
                      border: `6px solid ${analysis ? getColor(analysis.security_score) : 'rgba(255,255,255,0.05)'}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "36px",
                      fontWeight: "900",
                      color: analysis ? getColor(analysis.security_score) : '#475569',
                      background: analysis ? "linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.3))" : "transparent",
                      "--dial-color": analysis ? (analysis.security_score < 35 ? "255, 77, 79" : analysis.security_score < 70 ? "250, 204, 21" : "34, 197, 94") : "71, 85, 105",
                    }}
                  >
                    {analysis ? analysis.security_score : <span className="standby-icon" style={{fontSize: "28px"}}>⏳</span>}
                  </div>
                  <h3 style={{ color: analysis ? getColor(analysis.security_score) : '#475569', margin: 0, fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px", fontSize: "1.1rem" }}>
                    {analysis ? getLabel(analysis.security_score) : "STANDBY"}
                  </h3>
                </div>
              </div>

              {/* HORIZONTAL METRICS WIDGET */}
              <div className="col-lg-9 col-md-8">
                <div className="glass-panel stagger-2" style={{ height: "100%", padding: "15px", display: "flex", gap: "15px" }}>
                  
                  {/* Metric 1: Length */}
                  <div className="metric-card">
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 5px 0", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>Total Length</p>
                    <h2 style={{ margin: 0, fontWeight: "900", fontSize: "1.8rem", color: analysis ? "#e2e8f0" : "#334155", display: "flex", alignItems: "baseline", gap: "6px" }}>
                      {analysis ? analysis.password_length : "0"} <span style={{fontSize:"13px", color:"#475569", fontWeight: "600", letterSpacing: "1px"}}>CHARS</span>
                    </h2>
                  </div>

                  {/* Metric 2: Entropy */}
                  <div className="metric-card">
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 5px 0", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>Math Entropy</p>
                    <h2 style={{ margin: 0, fontWeight: "900", fontSize: "1.8rem", color: analysis ? "#e2e8f0" : "#334155", display: "flex", alignItems: "baseline", gap: "6px" }}>
                      {analysis ? analysis.entropy : "0.0"} <span style={{fontSize:"13px", color:"#475569", fontWeight: "600", letterSpacing: "1px"}}>BITS</span>
                    </h2>
                  </div>

                  {/* Metric 3: Crack Time (Highlighted) */}
                  <div className="metric-card" style={{ background: analysis ? "linear-gradient(135deg, rgba(250, 204, 21, 0.08), rgba(250, 204, 21, 0.02))" : "rgba(0,0,0,0.3)", borderColor: analysis ? "rgba(250, 204, 21, 0.2)" : "rgba(255,255,255,0.03)" }}>
                    <p style={{ fontSize: "11px", color: analysis ? "#facc15" : "#64748b", margin: "0 0 5px 0", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>Crack Time Estimate</p>
                    <h2 style={{ color: analysis ? "#facc15" : "#334155", margin: 0, fontWeight: "900", fontSize: "1.8rem", letterSpacing: "-0.5px" }}>
                      {analysis ? `⏳ ${analysis.crack_time_readable}` : "⏳ --"}
                    </h2>
                  </div>

                </div>
              </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="row g-3">
              
              {/* LEFT: Suggestions & Improvements */}
              <div className="col-lg-5 col-md-12">
                <div className={`glass-panel stagger-3 ${analysis ? 'scanning-active' : ''}`} style={{ height: "100%", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                  
                  <h5 style={{ color: analysis ? "#22c55e" : "#475569", marginBottom: "15px", fontWeight: "900", display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase", letterSpacing: "1px", fontSize: "13px" }}>
                    <span style={{background: analysis ? "rgba(34, 197, 94, 0.15)" : "rgba(255,255,255,0.03)", padding: "6px", borderRadius: "8px", fontSize: "16px"}}>🔐</span> Suggested Overrides
                  </h5>

                  {analysis?.suggestions?.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {analysis.suggestions.map((p, i) => (
                        <div
                          key={i}
                          className="suggestion-row"
                          style={{
                            background: "rgba(34, 197, 94, 0.03)",
                            border: "1px solid rgba(34, 197, 94, 0.15)",
                            padding: "8px 12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: "8px",
                            fontFamily: "'Courier New', Courier, monospace",
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#e2e8f0",
                          }}
                        >
                          {p}
                          <button
                            className="copy-btn"
                            onClick={() => copyPassword(p)}
                            style={{
                              background: "rgba(34, 197, 94, 0.1)",
                              border: "1px solid rgba(34, 197, 94, 0.3)",
                              borderRadius: "6px",
                              padding: "4px 12px",
                              color: "#22c55e",
                              fontWeight: "900",
                              cursor: "pointer",
                              fontSize: "11px",
                              letterSpacing: "1px"
                            }}
                          >
                            COPY
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : analysis ? (
                    <div style={{ background: "rgba(34, 197, 94, 0.05)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(34, 197, 94, 0.1)", color: "#22c55e", fontStyle: "italic", textAlign: "center", fontSize: "13px" }}>
                      No suggestions required. Password is optimal.
                    </div>
                  ) : (
                    <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", color: "#334155", fontStyle: "italic", textAlign: "center", fontSize: "13px", border: "1px solid rgba(255,255,255,0.02)" }}>
                      Awaiting target sequence...
                    </div>
                  )}

                  {/* 🔥 ADDED DIVIDER HERE to fix the gap issue nicely */}
                  {analysis && (
                    <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)", margin: "20px 0 15px 0" }}></div>
                  )}
                  {/* Notice that we completely removed marginTop: "auto" from this h5 below */}
                  <h5 style={{ color: analysis ? "#3b82f6" : "#475569", marginBottom: "15px", fontWeight: "900", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "1px", fontSize: "13px", marginTop: analysis ? "0" : "20px" }}>
                    <span style={{background: analysis ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.03)", padding: "6px", borderRadius: "8px", fontSize: "16px"}}>💡</span> Vulnerability Report
                  </h5>

                  {analysis?.improvements?.length > 0 ? (
                    <ul style={{ color: "#cbd5e1", paddingLeft: "20px", lineHeight: "1.5", margin: 0, fontSize: "13px" }}>
                      {analysis.improvements.map((s, i) => (
                        <li key={i} style={{marginBottom: "6px"}}>{s}</li>
                      ))}
                    </ul>
                  ) : analysis ? (
                    <div style={{ background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)", padding: "12px", borderRadius: "8px", color: "#22c55e", fontWeight: "bold", textAlign: "center", fontSize: "13px" }}>
                      ✨ Zero vulnerabilities detected. System Secure.
                    </div>
                  ) : (
                    <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", color: "#334155", fontStyle: "italic", textAlign: "center", fontSize: "13px", border: "1px solid rgba(255,255,255,0.02)" }}>
                      Scan pending...
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: GRAPH */}
              <div className="col-lg-7 col-md-12">
                <div className={`glass-panel stagger-3 ${analysis ? 'scanning-active' : ''}`} style={{ height: "100%", padding: "20px", display: "flex", flexDirection: "column" }}>
                  <h5 style={{ color: analysis ? "#a855f7" : "#475569", marginBottom: "15px", fontWeight: "900", display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase", letterSpacing: "1px", fontSize: "13px" }}>
                    <span style={{background: analysis ? "rgba(168, 85, 247, 0.15)" : "rgba(255,255,255,0.03)", padding: "6px", borderRadius: "8px", fontSize: "16px"}}>📊</span> Relative Strength Analytics
                  </h5>

                  {analysis?.suggestions?.length > 0 ? (
                    <div style={{ flex: 1, minHeight: "220px", display: "flex", alignItems: "center", background: "rgba(0,0,0,0.4)", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.02)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.5)" }}>
                      <Bar
                        data={{
                          labels: analysis.suggestions.map((_, i) => `Override ${i + 1}`),
                          datasets: [
                            {
                              label: "Security Score",
                              data: analysis.suggestions.map((p) => calculateScore(p)),
                              backgroundColor: [
                                "rgba(34, 197, 94, 0.7)",
                                "rgba(59, 130, 246, 0.7)",
                                "rgba(168, 85, 247, 0.7)",
                              ],
                              borderColor: ["#22c55e", "#3b82f6", "#a855f7"],
                              borderWidth: 1,
                              borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
                              hoverBackgroundColor: [
                                "rgba(34, 197, 94, 1)",
                                "rgba(59, 130, 246, 1)",
                                "rgba(168, 85, 247, 1)",
                              ]
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: "rgba(15, 23, 42, 0.95)",
                              titleFont: { size: 12, family: "system-ui" },
                              bodyFont: { size: 14, weight: "bold", family: "system-ui" },
                              padding: 10,
                              cornerRadius: 6,
                              displayColors: false,
                              borderColor: "rgba(255,255,255,0.1)",
                              borderWidth: 1
                            }
                          },
                          scales: {
                            x: {
                              ticks: { color: "#94a3b8", font: { size: 11, weight: "bold" } },
                              grid: { display: false },
                              border: { display: false }
                            },
                            y: {
                              beginAtZero: true,
                              max: 100,
                              ticks: { color: "#64748b", stepSize: 25, font: { size: 11, weight: "bold" } },
                              grid: { color: "rgba(255,255,255,0.03)", borderDash: [4, 4] },
                              border: { display: false }
                            },
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="standby-icon" style={{ flex: 1, minHeight: "220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.02)", borderRadius: "10px", background: "rgba(0,0,0,0.3)" }}>
                      <div style={{ width: "50px", height: "50px", border: "3px solid #334155", borderRadius: "50%", borderTopColor: "transparent", animation: "scanLine 2s linear infinite", marginBottom: "15px" }}></div>
                      <p style={{ color: "#475569", margin: 0, fontWeight: "800", fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase" }}>Visualizer Standby</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordAnalyzer;