import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.signup(email, password);

      let verifiedUser = null;
      try {
        const me = await api.me();
        verifiedUser = me?.user ?? me ?? true;
      } catch {
        verifiedUser = true;
      }
      window.dispatchEvent(new CustomEvent("auth:changed", { detail: { user: verifiedUser } }));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mama-main">
      <div className="recipe-card pop-in auth-card">
        <div className="card-header">
          <div className="title-area">
            <h2 className="bubble-title">📝 Sign&nbsp;Up</h2>
          </div>
        </div>
        <form className="section auth-form" onSubmit={onSubmit}>
          <div className="form-row">
            <label className="section-title" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label className="section-title" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-bubble" style={{ marginTop: 12 }}>{error}</div>}
          <div className="section actions auth-actions">
            <button className="copy-btn" type="submit" disabled={loading}>
              {loading ? "Signing up…" : "Create account"}
            </button>
            <span className="source">
              Have an account? <Link to="/login">Login</Link>
            </span>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Signup;
