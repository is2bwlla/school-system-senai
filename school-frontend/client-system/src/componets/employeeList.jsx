import { useState, useEffect } from "react";
import axios from "axios";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        ni: "",
        phone: "",
        position: "",
        email: "",
    });

    const API_URL = "http://127.0.0.1:8000";

    // Fetch employees
    useEffect(() => {
        const fetchEmployees = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Usuário não autenticado.");
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/api/teachers/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmployees(response.data);
            } catch (error) {
                console.error("Erro ao buscar funcionários:", error.response?.data || error.message);
            }
        };

        fetchEmployees();
    }, []);

    // Função para abrir o modal e editar ou adicionar
    const openModal = (employee = null) => {
        setIsEditing(!!employee);
        setFormData({
            name: employee?.name || "",
            ni: employee?.ni || "",
            phone: employee?.phone || "",
            position: employee?.position || "",
            email: employee?.email || "",
        });
        setSelectedEmployee(employee);
        setModalOpen(true);
    };

    // Fechar modal
    const closeModal = () => {
        setSelectedEmployee(null);
        setModalOpen(false);
    };

    // Função para capturar as mudanças no formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Função para salvar ou editar os dados do funcionário
    const saveEmployee = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Usuário não autenticado.");
            return;
        }

        const employeeData = {
            name: formData.name,
            ni: formData.ni,
            phone: formData.phone,
            position: formData.position,
            email: formData.email,
        };

        try {
            let response;
            if (isEditing) {
                response = await axios.put(
                    `${API_URL}/api/teachers/${selectedEmployee.id}/`,
                    employeeData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setEmployees((prev) =>
                    prev.map((emp) =>
                        emp.id === selectedEmployee.id ? response.data : emp
                    )
                );
            } else {
                response = await axios.post(`${API_URL}/api/teachers/`, employeeData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmployees((prev) => [...prev, response.data]);
            }
            closeModal();
        } catch (error) {
            console.error("Erro ao salvar funcionário:", error.response?.data || error.message);
        }
    };

    // Função para excluir o funcionário
    const deleteEmployee = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Usuário não autenticado.");
            return;
        }

        try {
            await axios.delete(`${API_URL}/api/teachers/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
            closeModal();
        } catch (error) {
            console.error("Erro ao excluir funcionário:", error.response?.data || error.message);
        }
    };

    return (
        <div className="p-6">
            {/* Botão de adicionar novo funcionário */}
            <button
                className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-600"
                onClick={() => openModal()} // Abrir o modal de adicionar
            >
                Adicionar Funcionário
            </button>

            {/* Lista de funcionários */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((employee) => (
                    <div
                        key={employee.id}
                        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                        onClick={() => openModal(employee)}
                    >
                        <h3 className="text-lg font-semibold">{employee.name}</h3>
                        <p className="text-gray-600">{employee.position}</p>
                    </div>
                ))}
            </div>

            {/* Modal de informações */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            {isEditing ? "Editar Funcionário" : "Adicionar Funcionário"}
                        </h2>

                        {/* Formulário de edição ou adição */}
                        <div>
                            <label className="block mb-2">Nome</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                            />

                            <label className="block mb-2">Número de Identificação (NI)</label>
                            <input
                                type="text"
                                name="ni"
                                value={formData.ni}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                            />

                            <label className="block mb-2">Telefone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                            />

                            <label className="block mb-2">Posição</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                            />

                            <label className="block mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                            />
                        </div>

                        {/* Botões de ação */}
                        <div className="mt-4 flex justify-between">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                onClick={saveEmployee}
                            >
                                {isEditing ? "Salvar" : "Adicionar"}
                            </button>
                            {isEditing && (
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    onClick={() => deleteEmployee(selectedEmployee.id)}
                                >
                                    Excluir
                                </button>
                            )}
                        </div>

                        <button className="mt-4 text-gray-600 underline" onClick={closeModal}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
