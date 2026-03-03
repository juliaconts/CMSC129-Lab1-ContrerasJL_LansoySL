import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import DrawerLayout from "./components/DrawerLayout";

const App: React.FC = () => {
  return (
    <Routes>
    <Route path="/" element={<Login />} />

    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    
    <Route path="*" element={<Navigate to="/" replace />} />

    <Route path="/homepage" element={
        <DrawerLayout>
          <Homepage />
        </DrawerLayout>
      } />

    <Route path="/profile" element={
        <DrawerLayout>
          <Profile/>
        </DrawerLayout>
    }/>

    <Route path="/settings" element={
      <DrawerLayout>
        <Settings/>
      </DrawerLayout>      
    }/>
    
    </Routes>
  );
}

export default App;