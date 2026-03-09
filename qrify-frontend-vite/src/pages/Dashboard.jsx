import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [qrs, setQrs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5000/api/qr/myqr", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setQrs(res.data);
      })
      .catch(() => {
        setQrs([]);
      });
  }, [navigate]);

  const logout = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await axios.post(
          "http://localhost:5000/api/auth/logout",
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      // Ignore logout API errors and clear local session.
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      navigate("/");
    }
  };

  return (
    <div className="page-shell">
      <div className="panel dashboard-panel">
        <div className="dashboard-head">
          <div>
            <h2>My QR Dashboard</h2>
            <p className="muted">Logged in as: {localStorage.getItem("userEmail") || "User"}</p>
          </div>
          <div className="actions">
            <Link className="btn btn-primary" to="/generate">Generate New QR</Link>
            <button className="btn btn-ghost" onClick={logout}>Logout</button>
          </div>
        </div>

        {qrs.length === 0 && <p className="muted">No QR codes yet. Create your first one.</p>}

        <div className="qr-grid">
          {qrs.map((q) => (
            <div key={q._id} className="qr-card">
              <div className="qr-card-top">
                <span className="chip">{q.type}</span>
                <span className="chip chip-accent">{q.scanCount} scans</span>
              </div>
              <p><strong>Value:</strong> {q.text}</p>
              <p><strong>Created:</strong> {new Date(q.createdAt).toLocaleString()}</p>
              <p><strong>Expires:</strong> {q.expiryDate ? new Date(q.expiryDate).toLocaleString() : "No expiry"}</p>
              <p><strong>One-time:</strong> {q.oneTime ? "Yes" : "No"}</p>
              <p><strong>Password Protected:</strong> {q.hasPassword ? "Yes" : "No"}</p>
              <p className="link-wrap">
                <strong>Short Link:</strong>{" "}
                <a href={q.shortUrl} target="_blank" rel="noreferrer">
                  {q.shortUrl}
                </a>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
