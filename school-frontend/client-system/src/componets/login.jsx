import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // Importando ícones de olho
import { useNavigate } from "react-router-dom"; // Para navegação

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [ni, setNI] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [position, setPosition] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate(); // Hook de navegação
    const API_URL = "http://127.0.0.1:8000";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        if (!ni || !password) {
            setError("Preencha todos os campos.");
            return;
        }
    
        try {
            const tokenResponse = await axios.post(`${API_URL}/api/token/`, {
                username: ni,
                password: password,
            });
    
            const { access: token } = tokenResponse.data;
            localStorage.setItem("token", token);
            setSuccess("Login bem-sucedido!");
            navigate("/");
        } catch (err) {
            setError("Credenciais inválidas. Tente novamente.");
        }
    };    

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        if (!ni || !password || !firstName || !lastName || !email) {
            setError("Preencha todos os campos.");
            return;
        }
    
        try {
            const response = await axios.post(`${API_URL}/api/register/`, {
                ni: ni,
                name: `${firstName} ${lastName}`,
                email: email,
                position: "Professor",
                password: password
            });

            const tokenResponse = await axios.post(`${API_URL}/api/token/`, {
                username: ni,
                password: password,
            });
    
            localStorage.setItem("token", tokenResponse.data.access);
            setSuccess("Cadastro realizado com sucesso!");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.detail || "Erro ao cadastrar. Verifique os dados inseridos.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={isRegister ? handleSignup : handleLogin} className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {isRegister ? "Cadastro" : "Login"}
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Identificação (NI):</label>
                    <input
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                        type="text"
                        placeholder="123456"
                        value={ni}
                        onChange={(e) => setNI(e.target.value)}
                    />
                </div>

                {isRegister && (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome:</label>
                            <input
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                                type="text"
                                placeholder="Isabella"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome:</label>
                            <input
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                                type="text"
                                placeholder="Silva"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                            <input
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                                type="email"
                                placeholder="exemplo@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone:</label>
                            <input
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                                type="text"
                                placeholder="(11) 99999-9999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo:</label>
                            <select
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            >
                                <option value="">Selecione o cargo</option>
                                <option value="Professor">Professor</option>
                                <option value="Coordenador">Coordenador</option>
                                <option value="Diretor">Diretor</option>
                                {/* Adicione outras opções conforme necessário */}
                            </select>
                        </div>
                    </>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha:</label>
                    <div className="relative">
                        <input
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute top-2 right-2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

                <button type="submit" className="w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200">
                    {isRegister ? "Cadastrar" : "Entrar"}
                </button>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-700 rounded-md p-2 w-full hover:bg-gray-400 transition duration-200"
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError("");
                            setSuccess("");
                        }}
                    >
                        {isRegister ? "Já tem uma conta? Faça Login" : "Criar Conta"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
