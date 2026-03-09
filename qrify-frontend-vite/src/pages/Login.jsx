import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", res.data.user?.email || email);
      alert(res.data.message || "Login successful");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page-shell auth-shell">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="muted">Login to manage your QR collection.</p>

        <div className="field">
          <label>Email</label>
          <input
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            placeholder="Enter password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={login}>Login</button>
        <p className="muted">
          New user? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
