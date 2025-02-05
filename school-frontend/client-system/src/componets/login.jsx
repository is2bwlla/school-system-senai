import { useState } from "react";

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [ni, setNI] = useState(""); // Número de Identificação
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState(""); // Nome
    const [lastName, setLastName] = useState(""); // Sobrenome
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); // Telefone
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!ni || !password || (isRegister && (!firstName || !lastName || !email || !phone))) {
            setError("Preencha todos os campos.");
            return;
        }
        setError("");
        console.log(isRegister ? "Cadastro realizado!" : "Login realizado!");
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {isRegister ? "Cadastro" : "Login"}
                </h2>

                {/* Campo NI */}
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

                {/* Campos do Cadastro (AbstractUser) */}
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
                    </>
                )}

                {/* Campo Senha */}
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
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                {/* Botão de Ação */}
                <button type="submit" className="w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200">
                    {isRegister ? "Cadastrar" : "Entrar"}
                </button>

                {/* Alternar entre Login e Cadastro */}
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-700 rounded-md p-2 w-full hover:bg-gray-400 transition duration-200"
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        {isRegister ? "Já tem uma conta? Faça Login" : "Criar Conta"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
