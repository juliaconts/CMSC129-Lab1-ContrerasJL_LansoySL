import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingCircles from '../components/FloatingCircles';
import "./signup.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

  const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            // create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // save user to backend
            const response = await fetch("http://localhost:3000/auth/signup", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error);
                return;
            }
            navigate("/homepage");
        } catch (err: any) {
            setError(err.message || "An error occurred");
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <FloatingCircles />
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <fieldset className="fieldset">
                    <h1 className="text-4xl font-bold text-center text-white">Sign Up</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <label className="label">Email</label>
                    <input 
                        type="email" 
                        className="input" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="label">New Password</label>
                    <input 
                        type="password" 
                        className="input" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="label">Confirm Password</label>
                    <input 
                        type="password" 
                        className="input" 
                        placeholder="Confirm Password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button 
                        className="btn bg-black text-white border-none rounded-lg w-full text-[15px] mt-4"
                        onClick={handleSignup}
                    >
                    Sign Up
                    </button>
                    <p className="text-center mt-2">
                         Already have an account?{" "}
                        <a
                            className="text-primary hover:underline cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                        Login
                        </a>
                    </p>
                </fieldset>
            </div>
            </div>
        </div>
    );
}