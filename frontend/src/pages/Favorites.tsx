import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Analyse() {
    const { favorites, removeFavorite, user } = useAuth();
    return (
        
        <section>
            <h1>Favoris</h1>
            {!user ? (
                <p>Veuillez vous connecter pour voir vos favoris.</p>
            ) : favorites.length === 0 ? (
                <p>Vous n'avez pas encore ajouté de cryptomonnaies aux favoris.</p>
            ) : (
                <ul className="list">
                    {favorites.map((id) => (
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
