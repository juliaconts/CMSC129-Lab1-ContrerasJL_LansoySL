import React from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
    children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
    return (
        <>
            <div className="navbar bg-black text-white shadow-sm px-4 relative">

                {/* LEFT: Hamburger */}
                <div className="flex-none">
                    <label
                        htmlFor="main-drawer"
                        className="cursor-pointer hover:opacity-75"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="h-6 w-6 stroke-current"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </label>
                </div>

                {/* CENTER: Logo */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <NavLink
                        to="/"
                        className="text-xl font-semibold text-[#f34700]"
                    >
                        lostnfound
                    </NavLink>
                </div>

                {/* RIGHT: Notification Bell */}
                <div className="flex-none ml-auto">

                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="relative cursor-pointer p-2 hover:opacity-75"
                        >
                            <div className="indicator">
                                {/* Bell Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 17h5l-1.405-1.405A2.032 
                                           2.032 0 0118 14.158V11a6.002 
                                           6.002 0 00-4-5.659V5a2 
                                           2 0 10-4 0v.341C7.67 
                                           6.165 6 8.388 6 11v3.159c0 
                                           .538-.214 1.055-.595 
                                           1.436L4 17h5m6 0v1a3 
                                           3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>

                                {/* Notification Badge */}
                                <span className="badge badge-xs badge-error indicator-item">
                                    3
                                </span>
                            </div>
                        </div>

                        {/* Dropdown Content */}
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 text-black rounded-box z-[1] mt-3 w-64 p-2 shadow"
                        >
                            <li><a>New item reported</a></li>
                            <li><a>Your claim was approved</a></li>
                            <li><a>System update</a></li>
                        </ul>
                    </div>

                </div>
            </div>

            {children}
        </>
    );
};

export default Navbar;