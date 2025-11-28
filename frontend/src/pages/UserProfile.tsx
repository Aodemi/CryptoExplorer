import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { user } = useAuth();
  return (
    <section>
      <h1>Profil</h1>
      {user ? (
        <div className="card">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p>Non connecté.</p>
      )}
    </section>
  );
}
