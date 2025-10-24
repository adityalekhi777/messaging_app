import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import HomePage from "./pages/HomePage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={<PrivateRoute><HomePage /></PrivateRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;