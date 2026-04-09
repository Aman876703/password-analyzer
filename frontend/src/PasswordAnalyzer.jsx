import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const PasswordAnalyzer = () => {
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

  // 🔥 SCORE FUNCTION FOR GRAPH
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
          "Authorization": localStorage.getItem("token"),
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

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617, #0f172a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          borderRadius: "20px",
          padding: "20px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
        }}
      >

        <h2 style={{ textAlign: "center", color: "#00f0ff" }}>
          ⚡ PasswordGuard
        </h2><br></br>

        {/* 🔥 NAVBAR */}
        <div
        style={{
          width: "100%",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "10px",
        }}
      >
        {/* LEFT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <h4 style={{ color: "#00f0ff", margin: 0 }}>
            🔐 PasswordGuard
          </h4>

          {user && (
            <span style={{ color: "#94a3b8",fontSize:"23px",marginLeft:"60px" }}>
              👋 {user.name}
            </span>
          )}
        </div>

        {/* RIGHT SIDE */}
        <button
          onClick={handleLogout}
          style={{
            background: "#ff4d4f",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
        {/* HEADER */}
        

        {/* INPUT */}
        <div className="input-group my-3">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            value={password}
            onChange={handleChange}
            placeholder="Enter password..."
            style={{
              background: "#020617",
              color: "#00f0ff",
              border: "1px solid #00f0ff",
            }}
          />
          <button
            className="btn btn-outline-info"
            onClick={() => setShowPassword(!showPassword)}
          >
            👁
          </button>
        </div>

        {analysis && (
          <>
            {/* TOP */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              {/* SCORE */}
              <div
                style={{
                  flex: 1,
                  background: "#020617",
                  borderRadius: "15px",
                  padding: "15px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    margin: "auto",
                    border: `5px solid ${getColor(
                      analysis.security_score
                    )}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    color: getColor(analysis.security_score),
                  }}
                >
                  {analysis.security_score}
                </div>

                <p style={{ color: getColor(analysis.security_score) }}>
                  {getLabel(analysis.security_score)}
                </p>
              </div>

              {/* DETAILS */}
              <div
                style={{
                  flex: 2,
                  background: "#020617",
                  borderRadius: "15px",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p style={{fontSize:"18px",marginLeft:"20px",marginTop:"8px"}} >
                    <strong>Length :</strong> {analysis.password_length}
                  </p><br></br>
                  <p style={{fontSize:"18px",marginLeft:"20px"}}  >
                    <strong>Entropy :</strong> {analysis.entropy}
                  </p>
                </div>

                <div style={{ color: "#facc15", fontSize: "18px",marginTop:"8px",marginRight:"20px" }}>
                  ⏳Time To Crack : {analysis.crack_time_readable}
                </div>
              </div>
            </div>

            {/* BOTTOM */}
            <div style={{ display: "flex", gap: "20px" }}>
              {/* LEFT */}
              <div
                style={{
                  flex: 1,
                  background: "#020617",
                  borderRadius: "15px",
                  padding: "15px",
                }}
              >
                <h5 style={{ color: "#22c55e" }}>
                  🔐 Suggested Passwords
                </h5>

                {analysis?.suggestions?.length > 0 ? (
                  analysis.suggestions.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        border: "1px solid #22c55e",
                        padding: "8px",
                        marginBottom: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        borderRadius: "8px",
                      }}
                    >
                      {p}
                      <button
                        onClick={() => copyPassword(p)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#22c55e",
                        }}
                      >
                        📋
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#94a3b8" }}>
                    No suggestions needed 👍
                  </p>
                )}

                <h5 style={{ marginTop: "20px", color: "#22d3ee" }}>
                  💡 Improvements
                </h5>

                {analysis?.improvements?.length > 0 ? (
                  <ul>
                    {analysis.improvements.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Your password is already strong 🚀</p>
                )}
              </div>

              {/* RIGHT (GRAPH) */}
              <div
                style={{
                  flex: 1,
                  background: "#020617",
                  borderRadius: "15px",
                  padding: "15px",
                }}
              >
                <h5 style={{ color: "#22d3ee" }}>
                  📊 Suggestions Strength
                </h5>

                {analysis?.suggestions?.length > 0 ? (
                  <Bar
                  data={{
                    labels: analysis.suggestions.map((_, i) => `P${i + 1}`),
                    datasets: [
                      {
                        label: "Score",
                        data: analysis.suggestions.map((p) => calculateScore(p)),

                        // 🔥 THIS FIXES YOUR ISSUE
                        backgroundColor: [
                          "#22c55e",
                          "#3b82f6",
                          "#facc15"
                        ],
                        borderColor: [
                          "#22c55e",
                          "#3b82f6",
                          "#facc15"
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: {
                        ticks: { color: "#94a3b8" },
                      },
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: "#94a3b8" },
                        grid: { color: "#1e293b" },
                      },
                    },
                  }}
/>
                ) : (
                  <p>No data</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordAnalyzer;