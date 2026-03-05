import React from "react";
import Navbar from "../components/Navbar";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

interface LayoutProps {
  children: React.ReactNode;
}

const DrawerLayout: React.FC<LayoutProps> = ({ children }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  return (
    <div className="drawer">
      
      {/* Toggle Checkbox */} 
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT (Navbar lives here) */}
      <div className="drawer-content flex flex-col">
        <Navbar />
        <main className="p-4">{children}</main>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label htmlFor="main-drawer" className="drawer-overlay"></label>

        <aside className="w-64 min-h-full bg-white text-[#f34700] flex flex-col">

          {/* Header */}
          <div className="p-5 text-2xl font-bold border-b border-neutral-focus"
            style={{ fontSize: "35px", fontFamily: "Nerko One, cursive" }}>
            lostnfound
          </div>

          {/* Menu */}
          <ul className="menu p-4 flex-1 gap-2"
          style={{fontSize: "18px"}}>
            <li>
                <NavLink
                    to="/homepage"
                    onClick={() => window.location.assign("/homepage")}
                >
                Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/profile"
                    onClick={() => window.location.assign("/profile")}
                >
                Profile
                </NavLink>
            </li>
            <li>
              <NavLink 
                to="/deleted-posts"
                onClick={() => window.location.assign("/deleted-posts")}>
                Recently Deleted
                </NavLink>
            </li>
            <li>
              <NavLink 
                to="/settings"
                onClick={() => window.location.assign("/settings")}
                >
                Settings
                </NavLink>
            </li>
          </ul>

          {/* Logout */}
          <div className="p-4 border-t border-neutral-focus">
            <button
              className="text-error text-[18px]"
              onClick={() => setShowLogoutConfirm(true)}
            >
              🚪 Logout
            </button>
          </div>

        </aside>
      </div>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl z-10 p-8 max-w-sm mx-4 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Logout?</h3>
            <p className="text-gray-500 mb-6 text-sm">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 btn bg-gray-100 text-gray-700 border-none hover:bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await signOut(auth);
                  window.location.assign("/login");
                }}
                className="flex-1 btn bg-red-500 text-white border-none hover:bg-red-600 rounded-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DrawerLayout;