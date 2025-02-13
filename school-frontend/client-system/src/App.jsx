import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./componets/login";
import Home from "./pages/home";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verifique o token sempre que o componente for montado ou re-renderizado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false); // Caso o token não exista, garantir que a navegação para login aconteça
    }
  }, []); // Só verifica uma vez na montagem

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/" element={isLoggedIn ? <Home /> : <Login setIsLoggedIn={setIsLoggedIn} />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
