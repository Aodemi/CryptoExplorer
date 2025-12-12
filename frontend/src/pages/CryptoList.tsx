import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { coingeckoApiLocal } from "../services/fetchData";

type Market = {
  id: string; symbol: string; name: string; current_price?: number; image?: string; market_cap?: number;
  _id?: string; 
  coingeckoId?: string; 
};

export default function CryptoList() {
  const [items, setItems] = useState<Market[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [cooldown, setCooldown] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filteredItems, setFilteredItems] = useState<Market[]>([]);

  const { user } = useAuth();
  const perPage = 50;

  async function loadPage(p: number, replace = false) {
    setLoading(true);
    setError(null);
    try {
      const res = await coingeckoApiLocal.getCryptos(p, perPage);
      setItems((prev) => (replace ? res : [...prev, ...res]));
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
  
  useEffect(() => {
    let filtered = [...items];
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(crypto =>
        crypto.name.toLowerCase().includes(query) ||
        crypto.symbol.toLowerCase().includes(query)
      );
    }
    filtered.sort((a, b) => {
      if (sortBy === "price_asc") {
        return (a.current_price || 0) - (b.current_price || 0);
      }
      if (sortBy === "price_desc") {
        return (b.current_price || 0) - (a.current_price || 0);
      }
      return a.name.localeCompare(b.name);
    });
    setFilteredItems(filtered);
  }, [items, search, sortBy]);

  const getCryptoId = (crypto: Market) => {
    return crypto.coingeckoId || crypto.id || crypto.name.toLowerCase();
  };

  return (
    <section>
      <h1>Cryptos</h1>
      {error && <div className="error">{error}</div>}
      
      <div>
        <input
          type="text"
          placeholder="Rechercher une crypto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Trier par nom</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
      </div>
        
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>Total affiché: {filteredItems.length}</div>
        <div>
          <button disabled={loading || cooldown} onClick={() => { loadPage(1, true); setCooldown(true); setTimeout(() => setCooldown(false), 1500); }}>
            Rafraîchir
          </button>
          <button style={{ marginLeft: 8 }} disabled={loading || cooldown} onClick={() => { loadPage(page + 1); setCooldown(true); setTimeout(() => setCooldown(false), 1500); }}>
            Charger plus
          </button>
        </div>
      </div>
      
      <ul className="list">
        {filteredItems.map((crypto) => {
          const cryptoId = getCryptoId(crypto);
          
          return (
            <li key={`${cryptoId}-${crypto.symbol}`}>
              <div>
                <strong>{crypto.name}</strong> <small>({crypto.symbol})</small>
              </div>
              {crypto.current_price != null && <div>${crypto.current_price}</div>}
              <Link to={`/analyse/${cryptoId}`} className="btn">Analyser</Link>
            </li>
          );
        })}
      </ul>
      
      {loading && <p>Chargement…</p>}
    </section>
  );
}