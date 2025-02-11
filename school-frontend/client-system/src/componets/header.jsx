import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between border-b border-gray-200">
      <div className="text-2xl font-semibold text-gray-800">Client System</div>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition duration-200"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
