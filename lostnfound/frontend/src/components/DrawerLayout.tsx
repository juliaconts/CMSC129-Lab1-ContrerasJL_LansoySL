import React from "react";
import Navbar from "../components/Navbar";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

interface LayoutProps {
  children: React.ReactNode;
}

const DrawerLayout: React.FC<LayoutProps> = ({ children }) => {
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
            <NavLink
                to="/logout"
                className="text-error"
                onClick={async (e) => {
                    e.preventDefault();
                    const confirmed = window.confirm("Are you sure you want to logout?");
                    if (confirmed) {
                        await signOut(auth);
                        window.location.assign("/login");
                    }
                }}
            >
                🚪 Logout
            </NavLink>
        </div>

        </aside>
      </div>

    </div>
  );
};

export default DrawerLayout;