import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import PasswordAnalyzer from "./PasswordAnalyzer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/analyze" element={<PasswordAnalyzer />} />
      </Routes>
    </Router>
  );
}

export default App;