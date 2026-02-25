import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface NavbarProps {
    children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
    return (
        <>
            <div className="navbar bg-black text-white shadow-sm">
                <div className="flex-none">
                    <button className="bg-transparent border-0 cursor-pointer hover:opacity-75 ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                    </button>
                </div>
                <div className="flex-1 flex justify-center">
                    <a className="bg-transparent text-secondary-400 text-xl cursor-pointer">lostnfound</a>
                </div>
                <div className="flex-none">
                    <button className="bg-transparent border-0 cursor-pointer hover:opacity-75 mr-5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
                    </button>
                </div>
            </div>
            {children}
        </>
    );
}

export default Navbar;