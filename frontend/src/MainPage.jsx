import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// 🔥 1. HIGH-TECH CANVAS BACKGROUND COMPONENT
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
        ctx.fillStyle = "rgba(16, 185, 129, 0.5)";
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) {
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
            ctx.lineWidth = 0.6;
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

// 🔥 2. SCROLL ANIMATION COMPONENT
const FadeInSection = ({ children, animation = "fade-up", delay = "0ms", duration = "800ms" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`scroll-trigger ${animation} ${isVisible ? "is-visible" : ""}`}
      style={{ 
        transitionDelay: isVisible ? delay : "0ms",
        transitionDuration: duration 
      }}
    >
      {children}
    </div>
  );
};

// 🌟 MAIN PAGE COMPONENT
const MainPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* BACKGROUND EFFECTS */}
      <ParticleBackground />
      
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        zIndex: 0,
        pointerEvents: "none",
      }}></div>

      {/* EMBEDDED CSS */}
      <style>
        {`
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #020617; }
          ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #334155; }

          .scroll-trigger {
            opacity: 0;
            will-change: opacity, transform, filter;
          }

          .blur-in { filter: blur(10px); transform: translateY(20px) scale(0.95); transition: all var(--duration, 1s) cubic-bezier(0.16, 1, 0.3, 1); }
          .blur-in.is-visible { filter: blur(0px); transform: none; opacity: 1; }

          .fade-up { transform: translateY(50px); transition: all var(--duration, 0.8s) cubic-bezier(0.25, 0.46, 0.45, 0.94); }
          .fade-up.is-visible { transform: translateY(0); opacity: 1; }

          .scale-up { transform: scale(0.8); transition: all var(--duration, 0.6s) cubic-bezier(0.175, 0.885, 0.32, 1.275); }
          .scale-up.is-visible { transform: scale(1); opacity: 1; }

          .slide-left { transform: translateX(-60px); transition: all var(--duration, 0.8s) ease-out; }
          .slide-left.is-visible { transform: translateX(0); opacity: 1; }

          .slide-right { transform: translateX(60px); transition: all var(--duration, 0.8s) ease-out; }
          .slide-right.is-visible { transform: translateX(0); opacity: 1; }

          .feature-card, .faq-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 30px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            z-index: 10;
            backdrop-filter: blur(5px);
          }
          
          .feature-card:hover {
            transform: translateY(-8px);
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(16, 185, 129, 0.4);
            box-shadow: 0 15px 30px -10px rgba(16, 185, 129, 0.15);
          }

          .faq-card:hover {
            border-color: rgba(139, 92, 246, 0.4);
            box-shadow: 0 15px 30px -10px rgba(139, 92, 246, 0.15);
          }

          .primary-btn {
            background: #10b981;
            color: #020617;
            padding: 16px 36px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1.1rem;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
            position: relative;
            z-index: 10;
          }
          
          .primary-btn:hover {
            background: #059669;
            box-shadow: 0 0 35px rgba(16, 185, 129, 0.5);
            transform: translateY(-2px);
          }
        `}
      </style>

      {/* 🚀 NAVBAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 5%",
          background: "rgba(2, 6, 23, 0.7)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>⚡</span>
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "-0.5px" }}>
            PasswordGuard
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          {user && <span style={{ color: "#94a3b8", fontWeight: "500" }}>Hello, {user.name}</span>}
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255, 77, 79, 0.1)",
              border: "1px solid rgba(255, 77, 79, 0.3)",
              color: "#ff4d4f",
              padding: "8px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#ff4d4f";
              e.target.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(255, 77, 79, 0.1)";
              e.target.style.color = "#ff4d4f";
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🌟 HERO SECTION */}
      <section style={{ padding: "120px 20px 60px", textAlign: "center", position: "relative", zIndex: 10 }}>
        <FadeInSection animation="blur-in" duration="1s">
          <div>
            <span style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "8px 20px", borderRadius: "50px", fontSize: "0.9rem", fontWeight: "700", border: "1px solid rgba(16, 185, 129, 0.3)", display: "inline-block", marginBottom: "30px", letterSpacing: "1px" }}>
              v2.0 NEXT-GEN ANALYSIS IS LIVE
            </span>

            <h1 style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", fontWeight: "800", marginBottom: "20px", lineHeight: "1.1", maxWidth: "800px", margin: "0 auto 20px auto" }}>
              Don't wait until you're <br />
              <span style={{ background: "-webkit-linear-gradient(45deg, #10b981, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                already compromised.
              </span>
            </h1>
            
            <p style={{ fontSize: "1.15rem", color: "#94a3b8", maxWidth: "600px", margin: "0 auto 40px auto", lineHeight: "1.6" }}>
              Our military-grade AI analyzes entropy, detects known breach patterns, and predicts exact crack times locally in your browser.
            </p>

            <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="primary-btn" onClick={() => navigate("/analyze")}>
                Start Security Scan 🔒
              </button>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 🛡️ TRUST BANNER */}
      <section style={{ padding: "0 20px 80px", textAlign: "center", position: "relative", zIndex: 10 }}>
        <FadeInSection animation="fade-up" delay="200ms">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "30px", padding: "20px 40px", background: "rgba(255,255,255,0.03)", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(5px)" }}>
            <span style={{ color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>TRUSTED BY THOUSANDS TO SECURE:</span>
            <span style={{ color: "#94a3b8", fontWeight: "bold" }}>Banks</span>
            <span style={{ color: "#334155" }}>•</span>
            <span style={{ color: "#94a3b8", fontWeight: "bold" }}>Crypto Wallets</span>
            <span style={{ color: "#334155" }}>•</span>
            <span style={{ color: "#94a3b8", fontWeight: "bold" }}>Personal Emails</span>
          </div>
        </FadeInSection>
      </section>

      {/* 📊 STATS GRID */}
      <section style={{ padding: "80px 5%", borderTop: "1px solid rgba(255,255,255,0.02)", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <FadeInSection animation="fade-up">
            <h5 style={{ color: "#10b981", letterSpacing: "2px", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "15px" }}>THE HARSH REALITY</h5>
            <h2 style={{ fontSize: "2.8rem", fontWeight: "bold", margin: 0 }}>The Password Crisis</h2>
          </FadeInSection>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px", maxWidth: "1200px", margin: "0 auto" }}>
          {[
            { icon: "🚨", stat: "81%", text: "Breaches caused by weak passwords" },
            { icon: "🔄", stat: "51%", text: "People reuse the same password" },
            { icon: "⚡", stat: "1 sec", text: "Time to crack an 8-char lowercase pwd" },
            { icon: "🔓", stat: "300M+", text: "Passwords leaked annually" }
          ].map((item, index) => (
            <FadeInSection key={index} animation="scale-up" delay={`${index * 100}ms`}>
              <div className="feature-card" style={{ textAlign: "center", height: "100%" }}>
                <div style={{ fontSize: "3rem", marginBottom: "20px" }}>{item.icon}</div>
                <h3 style={{ fontSize: "3.5rem", color: "#10b981", margin: "0 0 10px 0", fontWeight: "800", letterSpacing: "-1px" }}>{item.stat}</h3>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "1.1rem" }}>{item.text}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ⚙️ HOW IT WORKS */}
      <section style={{ padding: "100px 5%", position: "relative", zIndex: 10 }}>
        <FadeInSection animation="fade-up">
          <h2 style={{ textAlign: "center", fontSize: "2.8rem", fontWeight: "bold", marginBottom: "80px" }}>How PasswordGuard Works</h2>
        </FadeInSection>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "900px", margin: "0 auto" }}>
          {[
            { step: "01", title: "Local Browser Input", desc: "Type your password into our secure field. Your data is processed entirely in your RAM. It never touches our servers.", align: "left", anim: "slide-left" },
            { step: "02", title: "Algorithm Analysis", desc: "We run complex mathematical checks calculating Shannon entropy, dictionary matches, and character set diversity.", align: "right", anim: "slide-right" },
            { step: "03", title: "Actionable Intelligence", desc: "Instantly see how long a GPU array would take to crack it, and copy generated variations to update your accounts.", align: "left", anim: "slide-left" }
          ].map((item, index) => (
            <FadeInSection key={index} animation={item.anim}>
              <div style={{ display: "flex", justifyContent: item.align === "left" ? "flex-start" : "flex-end" }}>
                <div className="feature-card" style={{ maxWidth: "600px", borderLeft: item.align === "left" ? "4px solid #10b981" : "1px solid rgba(255,255,255,0.05)", borderRight: item.align === "right" ? "4px solid #10b981" : "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "1.2rem", marginBottom: "10px", display: "block" }}>Step {item.step}</span>
                  <h3 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>{item.title}</h3>
                  <p style={{ color: "#94a3b8", lineHeight: "1.6", fontSize: "1.1rem", margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ✨ FEATURES */}
      <section style={{ padding: "100px 5%", position: "relative", zIndex: 10 }}>
        <FadeInSection animation="fade-up">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h5 style={{ letterSpacing: "2px", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "10px", color: "#8b5cf6" }}>ENGINEERED FOR SAFETY</h5>
            <h2 style={{ fontSize: "2.8rem", fontWeight: "bold", margin: 0 }}>Features That Matter</h2>
          </div>
        </FadeInSection>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px", maxWidth: "1200px", margin: "0 auto" }}>
          {[
            { icon: "🛡️", title: "Entropy Calculation", desc: "Measures the true randomness of your password to determine its mathematical strength against brute-force attacks." },
            { icon: "⏱️", title: "Crack Time Prediction", desc: "Estimates exactly how long it would take a modern hacker hardware setup (like an RTX 4090 rig) to guess your password." },
            { icon: "💡", title: "Smart Suggestions", desc: "Automatically generates memorable, highly-secure alternatives based on your input to replace weak passwords." },
            { icon: "🔒", title: "Zero-Knowledge Architecture", desc: "Your passwords are analyzed locally. Disconnect from the internet, and the analyzer will still work perfectly." }
          ].map((item, index) => (
            <FadeInSection key={index} animation="fade-up" delay={`${index * 100}ms`}>
              <div className="feature-card" style={{ height: "100%" }}>
                <div style={{ background: "rgba(139, 92, 246, 0.1)", width: "60px", height: "60px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", marginBottom: "25px", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", fontWeight: "700" }}>{item.title}</h3>
                <p style={{ color: "#94a3b8", lineHeight: "1.7", margin: 0 }}>{item.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ❓ FAQ SECTION (Restored!) */}
      <section style={{ padding: "100px 5%", position: "relative", zIndex: 10 }}>
        <FadeInSection animation="fade-up">
          <h2 style={{ textAlign: "center", fontSize: "2.8rem", fontWeight: "bold", marginBottom: "60px" }}>Frequently Asked Questions</h2>
        </FadeInSection>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", maxWidth: "800px", margin: "0 auto" }}>
          {[
            { q: "Is it safe to type my real password here?", a: "Yes. PasswordGuard uses a Zero-Knowledge Architecture. The code that analyzes your password runs completely inside your browser. Nothing is ever transmitted to a server." },
            { q: "What does 'Entropy' mean?", a: "Entropy is a mathematical concept used in cryptography to measure how unpredictable your password is. A higher entropy score (measured in bits) means it's much harder for a computer to guess." },
            { q: "Why is length more important than complexity?", a: "Adding one extra character to a password exponentially increases the combinations a hacker has to guess. A 16-character password with just letters is often stronger than an 8-character password with special symbols." }
          ].map((faq, index) => (
            <FadeInSection key={index} animation="fade-up" delay={`${index * 150}ms`}>
              <div className="faq-card">
                <h4 style={{ fontSize: "1.3rem", color: "white", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#8b5cf6" }}>Q.</span> {faq.q}
                </h4>
                <p style={{ color: "#94a3b8", margin: 0, paddingLeft: "32px", lineHeight: "1.6" }}>{faq.a}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* 🏁 BOTTOM CTA */}
      <section style={{ padding: "120px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 10 }}>
        <FadeInSection animation="scale-up">
          <div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: "800", marginBottom: "20px" }}>Ready to secure your digital life?</h2>
            <p style={{ color: "#94a3b8", marginBottom: "40px", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 40px auto" }}>Stop guessing if your passwords are safe. Get mathematical proof in seconds.</p>
            
            <button className="primary-btn" onClick={() => navigate("/analyze")} style={{ padding: "20px 50px", fontSize: "1.2rem" }}>
              Analyze My Password Free →
            </button>
          </div>
        </FadeInSection>
      </section>
      
      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.05)", color: "#475569", background: "rgba(0,0,0,0.5)", position: "relative", zIndex: 10, backdropFilter: "blur(10px)" }}>
        <p style={{ margin: 0, fontWeight: "500" }}>© 2026 PasswordGuard. Built with ❤️ and React.</p>
      </footer>
    </div>
  );
};

export default MainPage;