import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./pages/profile/profile";
import Navbar from "./components/navbar";
import { useUser } from "./context/userContext";

function App() {
  const { user } = useUser();

  return (
    <div>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
