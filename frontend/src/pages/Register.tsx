import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(email, username, password);
      nav("/cryptos");
    } catch (e: any) {
      setError(e?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Créer un compte</h1>
      <form onSubmit={onSubmit}>
        <label>Email<input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required /></label>
        <label>Username<input value={username} onChange={(e)=>setUsername(e.target.value)} required minLength={3} /></label>
        <label>Password<input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required /></label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading?"...":"Créer le compte"}</button>
      </form>
      <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
    </section>
  );
}
