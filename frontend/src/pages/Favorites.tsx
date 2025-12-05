import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Analyse() {
    const [favoritesIds, setFavoritesIds] = useState<string[]>([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavoritesIds(storedFavorites);
    }, []);
    const removeFavorite = (id: string) => {
        const updatedFavorites = favoritesIds.filter(favId => favId !== id);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setFavoritesIds(updatedFavorites);
    };
    return (
        
        <section>
            <Link to="/cryptos"> Retour</Link>
            <h1>Favoris</h1>
            {favoritesIds.length === 0 ? (
                <p>Vous n'avez pas encore ajouté de cryptomonnaies aux favoris.</p>
            ) : (
                <ul className="list">
                    {favoritesIds.map((id) => (
                        <li key={id}>
                            <span>{id}</span>
                            <button onClick={() => removeFavorite(id)}>Retirer des favoris</button>
                            <Link to={`/analyse/${id}`}>Voir l'analyse</Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}   
