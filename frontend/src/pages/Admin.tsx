import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

type AdminUser = {
    _id: string;
    email: string;
    username: string;
    role: string;
};

export default function Admin() {
    const { user } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.role === "admin") {
            loadUsers();
        }
    }, [user]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await api.get<AdminUser[]>("/admin/users");
            setUsers(data);
        }
        catch (e) {
            console.error("Echec du chargement des users", e);
        } finally {
            setLoading(false);
        }
    };
    const deleteUser = async (id: string) => {
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (e) {
            console.error("Echec de la suppression de l'utilisateur", e);
        }
    };

    const updateUserRole = async (id: string, role: string) => {
        try {
            await api.patch(`/admin/users/${id}/role`, { role });
            setUsers(users.map(u => u._id === id ? { ...u, role } : u));
        } catch (e) {
            console.error("Echec de la mise à jour du rôle de l'utilisateur", e);
        }
    };

    if (user?.role !== "admin") {
        return <div>Accès refusé. Vous n'êtes pas administrateur.</div>;
    }
    return (
        <div>
            <div>
                <h1>Gestion des utilisateurs </h1>
                <p>Nombre total d'utilisateurs: {users.length}</p>
            </div>
            {loading ? (<p>Chargement des utilisateurs...</p>) : (
                <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ padding: "10px", textAlign: "left" }}>Nom d'utilisateur</th>
                            <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
                            <th style={{ padding: "10px", textAlign: "left" }}>Rôle</th>
                            <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u) => (
                            <tr key={u._id} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "10px" }}>{u.username}</td>
                                <td style={{ padding: "10px" }}>{u.email}</td>
                                <td style={{ padding: "10px" }}>
                                    <select
                                        value={u.role}
                                        onChange={(e) => updateUserRole(u._id, e.target.value)}
                                        style={{ padding: "5px" }}
                                    >
                                        <option value="user">Utilisateur</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </td>
                                <td style={{ padding: "10px" }}>
                                    <button
                                        onClick={() => deleteUser(u._id)}
                                        style={{ padding: "5px 10px", backgroundColor: "#ff4d4f", color: "#fff", border: "none", cursor: "pointer" }}   
                                    >Supprimer</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                </table>
            )}
        </div>
    );
}

