import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import MainPage from "./MainPage"; // 🔥 1. Import the new Main Page
import PasswordAnalyzer from "./PasswordAnalyzer";

function App() {
  return (
    <Router>
      <Routes>
        {/* Your existing auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* 🔥 2. Add the route for the new Main Page */}
        <Route path="/main" element={<MainPage />} />
        
        {/* Your existing analyzer route */}
        <Route path="/analyze" element={<PasswordAnalyzer />} />
      </Routes>
    </Router>
  );
}

export default App;