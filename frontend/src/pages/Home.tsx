import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { coingeckoApiLocal, coingeckoApi } from "../services/fetchData";

export default function Home() {
  const { user, favorites } = useAuth();
  const [loading, setLoading] = useState(false);
  const [top5, setTop5] = useState<any[]>([]);
  const [favoritesData, setFavoritesData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [favorites]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const topData = await coingeckoApi.get("usd", 1, 5);
      setTop5(topData);
      
      if (favorites.length > 0) {
        const favsToLoad = favorites.slice(0, 5);
        const favsData = favsToLoad.map(favId => {
          const found = topData.find((crypto: any) => crypto.id === favId);
          if (found) return found;
          return { id: favId, name: "Inconnu", symbol: "", current_price: null };
        });
        setFavoritesData(favsData);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <section>
      <div>
        <h1>Bienvenue sur CryptoExplorer, {user ? user.username : "Invité"}</h1>
      </div>

      <div>
        <h2> Top 5 Global</h2>
        {top5.length === 0 ? (
          <p>Aucune donnée trouvée</p>
        ) : (
          <div>
            {top5.map((crypto) => (
              <div key={crypto.id} style={{marginBottom: "10px"}}>
                <strong>{crypto.name}</strong> ({crypto.symbol.toUpperCase()})
                <div>Prix: ${crypto.current_price}</div>
                <Link to={`/analyse/${crypto.id}`}>Analyser</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2> Vos Favoris</h2>
        <Link to="http://localhost:5173/favorites">Voir tous les favoris</Link>
        
        
      </div>

      
    </section>
  );
}