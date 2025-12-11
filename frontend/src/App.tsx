import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CryptoList from "./pages/CryptoList";
import UserProfile from "./pages/UserProfile";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Analyse from "./pages/Analyse";
import Favorites from "./pages/Favorites";
import Admin from "./pages/Admin";



function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function NavBar() {
  const { token, user, logout } = useAuth();
  return (
    <header className="nav">
      <nav>
        <Link to="/" className="nav-link">Home</Link>
        {token && <>
          <Link to="/cryptos" className="nav-link">Cryptos</Link>
          <Link to="/profile" className="nav-link">Profil</Link>
          <Link to="/favorites" className="nav-link">Favoris</Link>
          {token && user?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}
        </>}
      </nav>
      <div className="spacer" />
      {token ? (
        <div className="user-area">
          <span>{user?.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div className="user-area">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cryptos" element={<PrivateRoute><CryptoList /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="analyse/:id" element={<PrivateRoute><Analyse /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />

        </Routes>
      </main>
    </AuthProvider>
  );
}
