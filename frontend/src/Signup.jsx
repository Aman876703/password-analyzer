import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
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
        maxWidth: "400px",
        borderRadius: "20px",
        padding: "30px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "white",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#22c55e", marginBottom: "20px" }}>
        ✨ Create Account
      </h2>

      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #22c55e",
          background: "#020617",
          color: "#22c55e",
        }}
      />

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #22c55e",
          background: "#020617",
          color: "#22c55e",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #22c55e",
          background: "#020617",
          color: "#22c55e",
        }}
      />

      <button
        onClick={handleSignup}
        style={{
          width: "100%",
          padding: "10px",
          background: "#22c55e",
          border: "none",
          borderRadius: "8px",
          color: "#020617",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Signup
      </button>

      <p style={{ marginTop: "15px", color: "#94a3b8" }}>
        Already have an account?{" "}
        <span
          style={{ color: "#00f0ff", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Login
        </span>
      </p>
    </div>
  </div>
);
}

export default Signup;