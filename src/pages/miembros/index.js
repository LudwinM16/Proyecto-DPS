import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Swal from 'sweetalert2';

export default function ProyectosPage() {
        const router = useRouter();
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
        const [nombreUsuario, setNombreUsuario] = useState("");
        const [contraseña, setContraseña] = useState("");
        const [rolId, setRolId] = useState(3);
    
        const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        async function fetchProyectos() {
            try {
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                if (!usuario) {
                    setProyectos([]);
                    return;
                }
                const response = await fetch(`/api/proyectos?usuarioId=${usuario.id}`);
                const data = await response.json();
                setProyectos(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Error al cargar los proyectos');
            } finally {
                setLoading(false);
            }
        }
        fetchProyectos();
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

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


    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Panel de Administración</h1>
                <div>
                    {usuario && (
                        <span className="me-3">
                            Bienvenido, <strong>{usuario.nombre_usuario}</strong>
                        </span>
                    )} <button onClick={() => router.push('/miembros/tareas')} className="btn btn-info me-2">
                        Ver Tareas
                    </button>
                    <button onClick={() => router.push('/miembros/tareas')} className="btn btn-secondary me-2">
                        Ir a Mantenimiento
                    </button>
                    <button onClick={handleLogout} className="btn btn-danger">
                        Cerrar sesión
                    </button>
                </div>
            </div>
            <h1>Mis Proyectos</h1>
            {proyectos.length === 0 ? (
                <p>No tienes proyectos asignados.</p>
            ) : (
                <ul>
                    {proyectos.map(proyecto => (
                        <li key={proyecto.id}>{proyecto.nombre}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
