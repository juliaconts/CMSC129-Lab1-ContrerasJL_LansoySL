import { useNavigate } from "react-router-dom";
import './login.css';

export default function Login() {
  const navigate = useNavigate();

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
            <label className="label">Email</label>
            <input type="email" placeholder="Email" className="input input-bordered" />
            <label className="label">Password</label>
            <input type="password" placeholder="Password" className="input input-bordered" />
            <div className="mt-2">
              <button
                className="btn btn-primary w-full"
                onClick={() => navigate("/homepage")}
              >
                Login
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