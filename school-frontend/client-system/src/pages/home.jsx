import Header from "../componets/header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    // Quando a página carregar, se não houver token, redireciona para o login
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    if (!token) {
      navigate("/login");
    } else if (userName) {
        setUserName(userName);
    }
  }, [navigate]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Header userName={userName} />
      {/* Agora o prompt de senha foi removido */}
    </div>
  );
};

export default Home;
