import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import jwt from "jsonwebtoken";
import Swal from 'sweetalert2';


// Componente principal del adminpanel
export default function AdminPanel() {

    // Estados para el formulario de agregar usuario
    const router = useRouter();
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [rolId, setRolId] = useState(3);

    // Estados para el formulario de agregar usuario
    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [nuevoRol, setNuevoRol] = useState(3);
    // Estado para almacenar el usuario autenticado (extraído del token)
    const [usuario, setUsuario] = useState(null);


    const queryClient = useQueryClient();

    // Obtener lista de usuarios desde la API
    const { data: usuarios, isLoading, error } = useQuery({
        queryKey: ["usuarios"],
        queryFn: async () => {
            const res = await axios.get("/api/usuarios", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return res.data;
        }
    });

    // Modal para editar el usuario seleccionado
    const abrirModalEditar = (usuario) => {
        setUsuarioEditar(usuario);
        setNuevoNombre(usuario.nombre_usuario);
        setNuevaContrasena("");
        setNuevoRol(usuario.rol_id);
    };

    // Cerrar el modal de edición y limpiar campos
    const cerrarModalEditar = () => {
        setUsuarioEditar(null);
        setNuevoNombre("");
        setNuevaContrasena("");
        setNuevoRol(3);
    };

     // Validaciones para inputs (números, emojis, etc.)
    const limpiarTexto = (texto) => {
        return texto
            .replace(/[\d]/g, '')
            .replace(
                /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|\uFE0F|\u200D)/g,
                ''
            )
            .replace(/[^a-zA-Z\s_-]/g, '')
            .trim();
    };

    // Mutación para agregar un usuario
    const agregarUsuario = useMutation({
        mutationFn: async () => {
            console.log("⏳ Enviando solicitud a la API...");
            const res = await axios.post("/api/usuarios", {
                nombre_usuario: nombreUsuario,
                contrasena: contraseña,
                rol_id: rolId
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            console.log("✅ Respuesta recibida:", res.data);
            return res.data;
        },
        onSuccess: () => {
            Swal.fire('¡Éxito!', 'Usuario agregado correctamente', 'success');
            queryClient.invalidateQueries("usuarios");
            setNombreUsuario("");
            setContraseña("");
            setRolId(3);
        },
        onError: (error) => {
            console.error("❌ Error al agregar usuario:", error.response?.data || error.message);
            Swal.fire('Error', error.response?.data.error || 'No se pudo agregar el usuario', 'error');
        }
    });

    // Mutación para eliminar un usuario
    const eliminarUsuario = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`/api/usuarios/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
        },
        onSuccess: () => {
            Swal.fire('¡Eliminado!', 'Usuario eliminado correctamente', 'success');
            queryClient.invalidateQueries(["usuarios"]);
        },
        onError: (error) => {
            console.error("❌ Error al eliminar usuario:", error.response?.data || error.message);
            Swal.fire('Error', error.response?.data.error || 'No se pudo eliminar el usuario', 'error');
        }
    });

    // Mutación para editar un usuario
    const editarUsuario = useMutation({
        mutationFn: async () => {
            await axios.put(`/api/usuarios/${usuarioEditar.id}`, {
                nombre_usuario: nuevoNombre,
                contrasena: nuevaContrasena || undefined,
                rol_id: nuevoRol
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
        },
        onSuccess: () => {
            Swal.fire('¡Actualizado!', 'Usuario modificado correctamente', 'success');
            queryClient.invalidateQueries(["usuarios"]);
            cerrarModalEditar();
        },
        onError: (error) => {
            console.error("❌ Error al editar usuario:", error.response?.data || error.message);
            Swal.fire('Error', error.response?.data.error || 'No se pudo editar el usuario', 'error');
        }
    });

    // Validación de token del usuario cuando se carga el adminpanel
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
        } else {
            const user = jwt.decode(token);
            setUsuario(user);

            // Comprobación de rol de admin para ver este panel
            if (!user || user.rol !== 1) {
                Swal.fire("Acceso denegado", "No tienes permisos para ver esta página", "error");
                router.push("/dashboard");
            }
        }
    }, [router]);

    // Manejo de cierre de sesión
    const handleLogout = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Se cerrará la sesión actual",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                router.push("../");
            }
        });
    };


    // Mostrar mensaje mientras carga la página o error
    if (isLoading) return <p className="text-center mt-4">Cargando usuarios...</p>;
    if (error) return <p className="text-center text-danger mt-4">Error al cargar usuarios.</p>;

    return (
        <div className="container mt-5">

        {/* Encabezados */}
        
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Panel de Administración</h1>
                <div>
                    {usuario && (
                        <span className="me-3">
                            Bienvenido, <strong>{usuario.nombre_usuario}</strong>
                        </span>
                    )} <button onClick={() => router.push('/admin/auditoria')} className="btn btn-info me-2">
                        Ver Auditoría
                    </button>
                    <button onClick={() => router.push('/admin/mantenimiento')} className="btn btn-secondary me-2">
                        Ir a Mantenimiento
                    </button>

                    <button onClick={() => router.push('/gerente/proyectos')} className="btn btn-secondary me-2">
                        Ir a Proyectos
                    </button>
                    <button onClick={handleLogout} className="btn btn-danger">
                        Cerrar sesión
                    </button>
                </div>
            </div>

            {/* Formulario para agregar usuario */}
            <div className="card mb-4">
                <div className="card-header">Agregar Usuario</div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label"><b>Nombre de usuario</b></label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre de usuario"
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(limpiarTexto(e.target.value))}
                        />

                    </div>

                    <div className="mb-3">
                        <label className="form-label"><b>Contraseña</b></label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Contraseña"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label"><b>Rol</b></label>
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


            {/* Modal para editar usuario */}
            {usuarioEditar && (
                <div className="modal d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Usuario</h5>
                                <button type="button" className="btn-close" onClick={() => setUsuarioEditar(null)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Nombre de usuario"
                                    value={nuevoNombre}
                                    onChange={(e) => setNuevoNombre(limpiarTexto(e.target.value))}
                                />
                                <input
                                    type="password"
                                    className="form-control mb-2"
                                    placeholder="Nueva contraseña (opcional)"
                                    value={nuevaContrasena}
                                    onChange={(e) => setNuevaContrasena(e.target.value)}
                                />
                                <select
                                    className="form-select"
                                    value={nuevoRol}
                                    onChange={(e) => setNuevoRol(Number(e.target.value))}
                                >
                                    <option value="1">Administrador</option>
                                    <option value="2">Gerente de Proyectos</option>
                                    <option value="3">Miembro del Equipo</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setUsuarioEditar(null)}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={() => editarUsuario.mutate()}>Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


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
                                        <div className="d-flex">
                                            <button
                                                className="btn btn-warning btn-sm me-2 mb-1"
                                                onClick={() => abrirModalEditar(usuario)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm mb-1"
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: '¿Estás seguro?',
                                                        text: "¡No podrás revertir esto!",
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonColor: '#3085d6',
                                                        cancelButtonColor: '#d33',
                                                        confirmButtonText: 'Sí, eliminar',
                                                        cancelButtonText: 'Cancelar'
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            eliminarUsuario.mutate(usuario.id);
                                                        }
                                                    });
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </div>

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