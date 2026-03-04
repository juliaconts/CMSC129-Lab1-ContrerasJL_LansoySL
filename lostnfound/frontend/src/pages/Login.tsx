import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import './login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/homepage");
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row gap-50">
        <div className="text-center lg:text-left">
          <h1 className="text-secondary text-5xl font-bold">lostnfound </h1>
          <p className="py-6">
            Welcome back! Enter your credentials to access the dashboard.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <div className="card-body">
            <h1 className="text-4xl font-bold text-center text-white mt-5">Login</h1>

            {error && (
              <div className="bg-red-500/20 text-red-400 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <label className="label">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <div className="mt-2">
              <button
                className="btn bg-black text-white border-none rounded-lg w-full text-[15px] disabled:opacity-60"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p className="text-center mt-4">
                Don't have an account?{" "}
                <a
                  className="text-primary hover:underline cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}