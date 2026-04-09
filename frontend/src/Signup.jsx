import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// 🔥 1. HIGH-TECH CANVAS BACKGROUND (Network with connecting lines)
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
        ctx.fillStyle = "rgba(34, 197, 94, 0.4)"; // Green particles
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
            ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / 150})`; // Cyan connecting lines
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
        position: "absolute",
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

function Signup() {
  // 🛑 LOGIC REMAINS 100% UNTOUCHED 🛑
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (data.message) {
        alert("Signup successful ✅");
        navigate("/");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };
  // 🛑 END OF LOGIC 🛑

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Animations */}
      <ParticleBackground />
      
      {/* Holographic Grid Panning */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "200%",
        background: "linear-gradient(rgba(34, 197, 94, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.02) 1px, transparent 1px)", 
        backgroundSize: "40px 40px",
        zIndex: 0,
        pointerEvents: "none",
        animation: "panGrid 60s linear infinite"
      }}></div>

      {/* Glow behind the card */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 70%)",
        zIndex: 0,
        pointerEvents: "none",
      }}></div>

      {/* 🔥 EMBEDDED CSS FOR UI EFFECTS */}
      <style>
        {`
          @keyframes panGrid {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }

          /* System Boot Entrance Animations */
          @keyframes cyberBoot {
            0% { opacity: 0; filter: blur(10px); transform: translateY(30px) scale(0.95); }
            100% { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); }
          }
          
          .stagger-1 { animation: cyberBoot 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .stagger-2 { animation: cyberBoot 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0; }
          .stagger-3 { animation: cyberBoot 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
          .stagger-4 { animation: cyberBoot 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards; opacity: 0; }
          .stagger-5 { animation: cyberBoot 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; opacity: 0; }
          .stagger-6 { animation: cyberBoot 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.75s forwards; opacity: 0; }

          /* Glass Panel */
          .cyber-card {
            background: rgba(15, 23, 42, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(24px);
            border-radius: 24px;
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(34, 197, 94, 0.03);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
          }
          
          .cyber-card:hover {
            border-color: rgba(34, 197, 94, 0.2); 
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(34, 197, 94, 0.1); 
            transform: translateY(-2px);
          }

          /* GLITCH-FREE WRAPPER SYSTEM (Same as Login Page) */
          .input-container {
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            position: relative;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            align-items: center;
          }

          .input-container::before {
            content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
            background: #22c55e; opacity: 0; transition: opacity 0.3s ease;
          }

          .input-container:focus-within {
            box-shadow: 0 0 25px rgba(34, 197, 94, 0.2), 0 5px 15px rgba(0,0,0,0.6);
            transform: scale(1.02);
            border-color: rgba(34, 197, 94, 0.4);
            background: rgba(0, 20, 10, 0.8);
          }
          
          .input-container:focus-within::before {
            opacity: 1;
          }

          .cyber-input {
            background: transparent !important;
            color: #22c55e !important;
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
            width: 100%;
            padding: 16px 15px;
            font-size: 16px;
            letter-spacing: 1px;
          }
          
          .cyber-input::placeholder {
            color: rgba(148, 163, 184, 0.5);
            letter-spacing: normal;
          }

          /* Button */
          .cyber-btn {
            background: linear-gradient(90deg, #22c55e, #10b981);
            background-size: 200% auto;
            color: #020617;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .cyber-btn:hover {
            background-position: right center;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
            background: #fff !important; 
            color: #020617 !important;
          }

          /* Links & Extras */
          .cyber-link {
            transition: all 0.2s ease;
            text-decoration: none;
            position: relative;
          }
          
          .cyber-link::after {
            content: ''; position: absolute; width: 100%; transform: scaleX(0);
            height: 1px; bottom: -2px; left: 0; background-color: #00f0ff;
            transform-origin: bottom right; transition: transform 0.25s ease-out;
          }

          .cyber-link:hover {
            color: #00f0ff !important; 
            text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
          }

          .cyber-link:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
          }
          
          .cyber-emoji {
            display: inline-block;
            transition: transform 0.3s ease;
          }
          .cyber-card:hover .cyber-emoji {
            transform: scale(1.2) rotate(10deg);
          }
        `}
      </style>

      {/* 🌟 MAIN SIGNUP CONTAINER */}
      <div
        className="cyber-card stagger-1"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "45px 35px",
          color: "white",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div className="stagger-2" style={{ marginBottom: "35px" }}>
          <div style={{ 
            width: "60px", height: "60px", margin: "0 auto 15px auto", 
            background: "rgba(34, 197, 94, 0.1)", borderRadius: "16px", 
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(34, 197, 94, 0.3)", boxShadow: "0 0 20px rgba(34, 197, 94, 0.2)"
          }}>
            <span className="cyber-emoji" style={{ fontSize: "28px" }}>✨</span>
          </div>
          <h2 style={{ margin: 0, fontWeight: "900", fontSize: "2rem", letterSpacing: "1px", background: "-webkit-linear-gradient(45deg, #fff, #22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            SYSTEM ACCESS
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "0.95rem", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "600" }}>
            Initialize new operator account
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "35px" }}>
          
          {/* Name Input with Icon Wrapper */}
          <div className="input-container stagger-3">
            <div style={{ padding: "0 15px", color: "#475569" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <input
              type="text"
              className="cyber-input"
              placeholder="Operator Full Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Input with Icon Wrapper */}
          <div className="input-container stagger-4">
            <div style={{ padding: "0 15px", color: "#475569" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <input
              type="email"
              className="cyber-input"
              placeholder="Secure Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input with Icon Wrapper */}
          <div className="input-container stagger-5">
            <div style={{ padding: "0 15px", color: "#475569" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <input
              type="password"
              className="cyber-input"
              placeholder="Security Passkey"
              onChange={(e) => setPassword(e.target.value)}
              style={{ letterSpacing: password.length > 0 ? "4px" : "1px" }}
            />
          </div>
        </div>

        <div className="stagger-6">
          <button
            className="cyber-btn"
            onClick={handleSignup}
            style={{
              width: "100%",
              padding: "18px",
              border: "none",
              borderRadius: "12px",
              fontWeight: "900",
              fontSize: "16px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Create Credentials
          </button>
        </div>

        <div className="stagger-6" style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
            Entity already initialized?{" "}
            <span
              className="cyber-link"
              style={{ color: "#00f0ff", fontWeight: "bold", cursor: "pointer", marginLeft: "5px" }}
              onClick={() => navigate("/")}
            >
              Authenticate now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;