import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import HomePage from "./pages/HomePage";
import AuthNavbar from "./components/AuthNavbar/AuthNavbar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><>
          <AuthNavbar />
          <Login />
        </></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><>
          <AuthNavbar />
          <Signup />
        </></PublicRoute>} />
        <Route
          path="/"
          element={<PrivateRoute><HomePage /></PrivateRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;