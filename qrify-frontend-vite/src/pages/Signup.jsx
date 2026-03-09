import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        password,
      });

      alert(res.data?.message || "Signup Successful");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Signup Failed";

      alert(message);
    }
  };

  return (
    <div className="page-shell auth-shell">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="muted">Start generating smart QR codes in seconds.</p>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Choose a secure password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={signup}>Signup</button>
        <p className="muted">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
