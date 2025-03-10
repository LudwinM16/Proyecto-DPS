import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import jwt from "jsonwebtoken";



export default function AdminPanel() {
    const router = useRouter();
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [rolId, setRolId] = useState(3);

    const queryClient = useQueryClient();

    // Obtener usuarios desde la API
    const { data: usuarios, isLoading, error } = useQuery({
        queryKey: ["usuarios"],
        queryFn: async () => {
            const res = await axios.get("/api/usuarios", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return res.data;
        }
    });


    // Mutación para agregar usuario
    const agregarUsuario = useMutation({
        mutationFn: async () => {
            console.log("⏳ Enviando solicitud a la API...");
            const res = await axios.post("/api/usuarios", {
                nombre_usuario: nombreUsuario,
                contrasena: contraseña, // Asegúrate que coincida con la BD
                rol_id: rolId
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
    
            console.log("✅ Respuesta recibida:", res.data);
            return res.data;
        },
        onSuccess: () => {
            console.log("🎉 Usuario agregado con éxito!");
            queryClient.invalidateQueries("usuarios"); // Actualizar la lista
            setNombreUsuario("");
            setContraseña("");
            setRolId(3);
        },
        onError: (error) => {
            console.error("❌ Error al agregar usuario:", error.response?.data || error.message);
        }
    });
    


    // Mutación para eliminar usuario
    const eliminarUsuario = useMutation(async (id) => {
        await axios.delete(`/api/usuarios/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        queryClient.invalidateQueries("usuarios");
    });

    // Redirigir si el usuario no es administrador
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
        } else {
            const user = jwt.decode(token); // Decodificar correctamente
            console.log("Datos del usuario:", user); // Verifica en la consola

            if (!user || user.rol !== 1) {
                router.push("/dashboard");
            }
        }
    }, [router]);


    if (isLoading) return <p className="text-center mt-4">Cargando usuarios...</p>;
    if (error) return <p className="text-center text-danger mt-4">Error al cargar usuarios.</p>;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Panel de Administración</h1>

            {/* Formulario para agregar usuario */}
            <div className="card mb-4">
                <div className="card-header">Agregar Usuario</div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Nombre de usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre de usuario"
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Contraseña"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Rol</label>
                        <select
                            className="form-select"
                            value={rolId}
                            onChange={(e) => setRolId(Number(e.target.value))}
                        >
                            <option value="1">Administrador</option>
                            <option value="2">Gerente de Proyectos</option>
                            <option value="3">Miembro del Equipo</option>
                        </select>
                    </div>

                    <button
                        className="btn btn-primary w-100"
                        onClick={() => agregarUsuario.mutate()}
                    >
                        Agregar Usuario
                    </button>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="card">
                <div className="card-header">Lista de Usuarios</div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios?.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.nombre_usuario}</td>
                                    <td>
                                        {usuario.rol_id === 1 ? "Administrador" :
                                            usuario.rol_id === 2 ? "Gerente" : "Miembro"}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminarUsuario.mutate(usuario.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
