import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App: React.FC = () => {
  return (
    <Routes>
    <Route path="/" element={<Login />} />

    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    
    <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;