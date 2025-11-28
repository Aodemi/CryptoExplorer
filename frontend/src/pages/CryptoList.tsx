import { useEffect, useState } from "react";
import { api } from "../api/client";

type Market = { id: string; symbol: string; name: string; current_price?: number };

export default function CryptoList() {
  const [items, setItems] = useState<Market[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [cooldown, setCooldown] = useState(false);
  const perPage = 100;

  async function loadPage(p: number, replace = false) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ count: number; data: Market[] }>(`/markets?vs_currency=usd&per_page=${perPage}&page=${p}`);
      setItems((prev) => (replace ? res.data : [...prev, ...res.data]));
      setPage(p);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 429) {
        setError("Trop de requêtes. Réessayez dans quelques secondes…");
        setCooldown(true);
        setTimeout(() => setCooldown(false), 5000);
      } else {
        setError(e?.response?.data?.error || "Erreur de chargement");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage(1, true);
  }, []);

  return (
    <section>
      <h1>Cryptos</h1>
      {error && <div className="error">{error}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>Total affiché: {items.length}</div>
        <div>
          <button disabled={loading || cooldown} onClick={() => { loadPage(1, true); setCooldown(true); setTimeout(()=>setCooldown(false), 1500); }}>Rafraîchir</button>
          <button style={{ marginLeft: 8 }} disabled={loading || cooldown} onClick={() => { loadPage(page + 1); setCooldown(true); setTimeout(()=>setCooldown(false), 1500); }}>Charger plus</button>
        </div>
      </div>
      <ul className="list">
        {items.map((crypto) => (
          <li key={`${crypto.id}-${crypto.symbol}`}>
            <div>
              <strong>{crypto.name}</strong> <small>({crypto.symbol})</small>
            </div>
            {crypto.current_price != null && <div>${crypto.current_price}</div>}
          </li>
        ))}
      </ul>
      {loading && <p>Chargement…</p>}
    </section>
  );
}
