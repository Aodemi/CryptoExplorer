import { useEffect, useState } from "react";
import { api } from "../api/client";
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
        if (id) {
            fetchCryptoData(id);

        }
    }, [id]);

    const isFavorite = crypto && favorites.includes(crypto.id);


    const toggleFavorite = () => {
        if (!id || !user) return;
        if (favorites.includes(id)) removeFavorite(id);
        else addFavorite(id);
    };

    const fetchCryptoData = async (id: string) => {
        setLoading(true);
        try {
            const response = await coingeckoApi.get("usd", 1, 250);
            const found = response.find((c: any) => c.id === id);
            if (found)
                setCrypto(found);
        } catch (error) {
            console.error("Erreur lors du chargement des données de la crypto :", error);
        } finally {
            setLoading(false);
        }
    }
    if (loading) {
        return <div className="container">Chargement...</div>;
    }

    if (!crypto) {
        return (
            <div className="container">
                <p>Crypto introuvable</p>
                <Link to="/cryptos"> Retour</Link>
            </div>
        );
    }
    return (
        <div className="container">

            <h1>Analyse de {crypto.name} ({crypto.symbol.toUpperCase()})</h1>
            <p>Prix actuel : ${crypto.current_price?.toLocaleString()}</p>
            <p>Capitalisation boursière : ${crypto.market_cap?.toLocaleString()}</p>
            {crypto.price_change_percentage_24h && (
                <p>Variation 24h: {crypto.price_change_percentage_24h.toFixed(2)}%</p>
            )}
            {crypto.total_volume && (
                <p>Volume 24h: ${crypto.total_volume.toLocaleString()}</p>
            )}
            

            <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                <button className="btn" onClick={toggleFavorite}
                    disabled={!user}
                >   {isFavorite ? "★ Retirer des favoris" : "⭐ Ajouter aux favoris"}</button>
            </div>
            <div className="card" style={{ marginBottom: "30px" }}>
                <h3> Graphique des prix</h3>
                <CryptoChart cryptoName={crypto.name} cryptoId={crypto.id} />
            </div>

            <div>
                <h3>Score IA</h3>
                <p>82% de confiance</p>
                <p>Recommandation: ACHAT</p>
            </div>


        </div>
    );
}