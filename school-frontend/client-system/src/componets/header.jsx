import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between border-b border-gray-200">
      {/* Nome do sistema */}
      <div className="text-2xl font-semibold text-gray-800">Client System</div>

      {/* Dropdown de Funcionários */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          Funcionários
        </button>
        {isDropdownOpen && (
          <ul className="absolute right-0 mt-2 bg-white text-gray-800 border border-gray-200 rounded-md shadow-lg w-48">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Cadastrar</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Listar</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Editar</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Excluir</li>
          </ul>
        )}
      </div>

      {/* Botão de Logout */}
      <div className="flex items-center space-x-4">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

