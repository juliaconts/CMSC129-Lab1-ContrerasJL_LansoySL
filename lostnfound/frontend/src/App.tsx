import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import DeletedPosts from "./pages/DeletedPosts";
import DrawerLayout from "./components/DrawerLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <><>
      <Toaster position="bottom-right" />
    </><Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/homepage" element={<ProtectedRoute>
          <DrawerLayout>
            <Homepage />
          </DrawerLayout>
        </ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute>
          <DrawerLayout>
            <Profile />
          </DrawerLayout>
        </ProtectedRoute>} />

        <Route path="/deleted-posts" element={<ProtectedRoute>
          <DrawerLayout>
            <DeletedPosts />
          </DrawerLayout>
        </ProtectedRoute>}></Route>

        <Route path="/settings" element={<ProtectedRoute>
          <DrawerLayout>
            <Settings />
          </DrawerLayout>
        </ProtectedRoute>} />

      </Routes></>
  );
}

export default App;