import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      nav("/cryptos");
    } catch (e: any) {
      setError(e?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <label>Email<input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required /></label>
        <label>Password<input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required /></label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading?"...":"Login"}</button>
      </form>
      <p>Pas de compte ? <Link to="/register">Créer un compte</Link></p>
    </section>
  );
}
