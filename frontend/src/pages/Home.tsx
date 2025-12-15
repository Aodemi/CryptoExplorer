import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { coingeckoApi } from "../services/fetchData";
import CryptoCompareChart from "../components/CryptoCompareChart";

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [comparisonChartData, setComparisonChartData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    const topData = await coingeckoApi.get("usd", 1, 5);

    if (!Array.isArray(topData)) {
      console.error("topData n'est pas un tableau:", topData);
      setComparisonChartData(null);
      return;
    }
   const labels = topData.map(c => c.symbol?.toUpperCase() || "");
      const prices = topData.map(c => c.current_price || 0);
    
   setComparisonChartData({
        labels,
        datasets: [{
          label: 'Comparaison par prix Prix ',
          data: prices,
          backgroundColor: ['#5c4d51ff', '#5abe2bff', '#FFCE56', '#e100ffff', '#9966FF']
        }]
      });
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
    <section style={{ padding: "20px" }}>
      <div>
        <h1>Bienvenue sur CryptoExplorer, {user ? user.username : "Invité"}</h1>
      </div>

      <div>
        <h2>Comparaison des Top 5 Cryptos (Prix actuels)</h2>
        {comparisonChartData ? (
          <CryptoCompareChart comparisonData={comparisonChartData} />
        ) : (
          <p>Aucune donnée pour le graphique</p>
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <Link to="/favorites">Voir tous les favoris</Link>
      </div>
    </section>
  );
}