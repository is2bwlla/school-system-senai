import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./componets/login";
import Home from "./pages/home";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verifica se o token existe no localStorage
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true); // Define como logado se o token existir
    }
  }, []);

  return (
    <Router> {/* Colocando o Router ao redor de toda a aplicação */}
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Login />} /> {/* Redireciona para login se não estiver logado */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
