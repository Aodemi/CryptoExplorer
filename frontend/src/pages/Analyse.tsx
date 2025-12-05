import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import CryptoChart from "../components/CryptoChart";
import { useAuth } from "../context/AuthContext";

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

    const isFavorite = !!(id && favorites.includes(id));

    const toggleFavorite = () => {
        if (!id || !user) return;
        if (favorites.includes(id)) removeFavorite(id);
        else addFavorite(id);
    };

    const fetchCryptoData = async (id: string) => {
        setLoading(true);
        try {
            const response = await api.get(`/markets?vs_currency=usd&per_page=100`);
            const found = response.data.find((c: any) => c.id === id);
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
            <Link to="/cryptos" style={{ display: "block", marginBottom: "20px" }}>
                 Retour
            </Link>

            <h1>Analyse de {crypto.name} ({crypto.symbol.toUpperCase()})</h1>
            <p>Prix actuel : ${crypto.current_price?.toLocaleString()}</p>
            <p>Capitalisation boursière : ${crypto.market_cap?.toLocaleString()}</p>


            <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                <button className="btn" onClick={toggleFavorite}
                disabled={!user}
                >   {isFavorite ? "★ Retirer des favoris" : "⭐ Ajouter aux favoris"}</button>
            </div>
            <div className="card" style={{ marginBottom: "30px" }}>
                <h3> Graphique des prix</h3>
                <CryptoChart cryptoName={crypto.name} />
            </div>


        </div>
    );
}