import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import Profile from "./pages/Profile";
import Meetings from "./pages/Meetings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/generate" element={<Generate />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/meetings" element={<Meetings />} />
      <Route path="/meetings/:id" element={<Meetings />} />
    </Routes>
  );
}

export default App;