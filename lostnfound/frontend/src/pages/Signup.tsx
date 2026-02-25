import { useNavigate } from "react-router-dom"
import "./signup.css";

export default function Signup() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <fieldset className="fieldset">
                    <h1 className="text-4xl font-bold text-center text-white">Sign Up</h1>
                    <label className="label">Email</label>
                    <input type="email" className="input" placeholder="Email" />
                    <label className="label">New Password</label>
                    <input type="password" className="input" placeholder="Password" />
                    <label className="label">Confirm Password</label>
                    <input type="password" className="input" placeholder="Confirm Password" />
                    <button 
                        className="btn btn-neutral mt-4"
                        onClick={ () => navigate("/dashboard")}
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