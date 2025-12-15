import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { coingeckoApi } from "../services/fetchData";
import CryptoCompareChart from "../components/CryptoCompareChart";

export default function Favorites() {
    const { favorites, removeFavorite, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [favoritesData, setFavoritesData] = useState<any[]>([]);
    const [comparisonChartData, setComparisonChartData] = useState<any>(null);

    useEffect(() => {
        if (user && favorites.length > 0) {
            fetchFavoritesData();
        } else {
            setLoading(false);
        }
    }, [favorites, user]);

    const fetchFavoritesData = async () => {
        try {
            const promises = favorites.map(id => coingeckoApi.getCoinDetails(id));
            const results = await Promise.all(promises);
            const validData = results.filter(crypto => crypto !== null);
            setFavoritesData(validData);
            const labels = validData.map(c => c.symbol?.toUpperCase() || "");
            const prices = validData.map(c => c.market_data?.current_price?.usd || 0);

            setComparisonChartData({
                labels,
                datasets: [{
                    label: 'Prix des Cryptos Favorites',
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
        <section>
            <h1>Favoris</h1>

            {favorites.length === 0 ? (
                <p>Vous n'avez pas encore ajouté de cryptomonnaies aux favoris.</p>
            ) : (
                <>
                    <div>
                        <h2>Vos cryptos favorites</h2>
                        <ul className="list">
                            {favorites.map((id) => (
                                <li key={id}>
                                    <span>{id}</span>
                                    <button onClick={() => removeFavorite(id)}>Retirer des favoris</button>
                                    <Link to={`/analyse/${id}`}>Voir l'analyse</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2>Comparaison de vos favoris</h2>
                        {comparisonChartData && (
                            <CryptoCompareChart comparisonData={comparisonChartData} />
                        )}
                    </div>
                </>
            )}
        </section>
    );
}