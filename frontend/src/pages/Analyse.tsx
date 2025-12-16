import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import CryptoChart from "../components/CryptoChart";
import { useAuth } from "../context/AuthContext";
import { coingeckoApi } from "../services/fetchData";

export default function Analyse() {
    const { id } = useParams();
    const [crypto, setCrypto] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { user, favorites, addFavorite, removeFavorite } = useAuth();

    useEffect(() => {
        console.log("Analyse - ID:", id);
        if (id) {
            fetchCryptoData(id);
        }
    }, [id]);

    const isFavorite = id && favorites.includes(id);

    const toggleFavorite = () => {
        if (!crypto?.id || !user) return;
        if (favorites.includes(crypto.id)) {
            removeFavorite(crypto.id);
        } else {
            addFavorite(crypto.id);
        }
    };

    const fetchCryptoData = async (coinId: string) => {
        setLoading(true);
        try {
            const response = await coingeckoApi.getCoinDetails(coinId);

            if (response && response.id) {
                const cryptoData = {
                    id: response.id,
                    name: response.name,
                    symbol: response.symbol,
                    current_price: response.market_data?.current_price?.usd,
                    market_cap: response.market_data?.market_cap?.usd,
                    price_change_percentage_24h: response.market_data?.price_change_percentage_24h,
                    total_volume: response.market_data?.total_volume?.usd,
                    image: response.image?.small
                };

                console.log("Données pour affichage:", cryptoData);
                setCrypto(cryptoData);
            } else {
                console.warn("coinGecko n'a pas trouvé:", coinId);
            }
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    


    if (loading) {
        return <div className="container">Chargement...</div>;
    }

    if (!crypto) {
        return (
            <div className="container">
                <p>Crypto introuvable pour: {id}</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Analyse de {crypto.name} ({crypto.symbol?.toUpperCase()})</h1>
            <p>Prix actuel : ${crypto.current_price?.toLocaleString() || "N/A"}</p>
            <p>Capitalisation boursière : ${crypto.market_cap?.toLocaleString() || "N/A"}</p>

            {crypto.price_change_percentage_24h && (
                <p>Variation 24h: {crypto.price_change_percentage_24h.toFixed(2)}%</p>
            )}
            {crypto.total_volume && (
                <p>Volume 24h: ${crypto.total_volume.toLocaleString()}</p>
            )}

            <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                <button className="btn" onClick={toggleFavorite} disabled={!user}>
                    {isFavorite ? "★ Retirer des favoris" : "⭐ Ajouter aux favoris"}
                </button>
            </div>

            <div className="card" style={{ marginBottom: "30px" }}>
                <h3>Graphique des prix</h3>
                <CryptoChart cryptoName={crypto.name} cryptoId={crypto.id} />
            </div>

            <div>
                <h3>Note</h3>
                <p></p>
            </div>
        </div>
    );
}