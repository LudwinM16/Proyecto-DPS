import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";

export default function AsignarTarea() {
    const router = useRouter();
    const [proyectos, setProyectos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [tarea, setTarea] = useState({
        nombre: "",
        descripcion: "",
        estado: "Pendiente",
        proyecto_id: "",
        asignado_a: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProyectos();
        fetchUsuarios();
    }, []);

    const fetchProyectos = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se encontró el token de autenticación");
            }

            const res = await axios.get("/api/proyectos", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProyectos(res.data);
        } catch (err) {
            console.error("Error al obtener proyectos:", err);
            setError("Error al cargar proyectos.");
        }
    };

    const fetchUsuarios = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se encontró el token de autenticación");
            }

            const res = await axios.get("/api/usuarios", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsuarios(res.data);
        } catch (err) {
            console.error("Error al obtener usuarios:", err);
            setError("Error al cargar usuarios.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTarea((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se encontró el token de autenticación");
            }

            await axios.post("/api/tareas", tarea, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Éxito", "Tarea asignada correctamente", "success");
            router.push("/gerente");
        } catch (err) {
            console.error("Error al asignar tarea:", err);
            Swal.fire("Error", "No se pudo asignar la tarea", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center mt-4">Cargando...</p>;
    if (error) return <p className="text-center text-danger mt-4">{error}</p>;

    return (
        <div className="container mt-5">
            <h1>Asignar Nueva Tarea</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre de la Tarea</label>
                    <input type="text" className="form-control" name="nombre" value={tarea.nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" name="descripcion" value={tarea.descripcion} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select className="form-control" name="estado" value={tarea.estado} onChange={handleChange}>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Completada">Completada</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Proyecto</label>
                    <select className="form-control" name="proyecto_id" value={tarea.proyecto_id} onChange={handleChange} required>
                        <option value="">Seleccione un Proyecto</option>
                        {proyectos.map((proyecto) => (
                            <option key={proyecto.id} value={proyecto.id}>{proyecto.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Asignado a</label>
                    <select className="form-control" name="asignado_a" value={tarea.asignado_a} onChange={handleChange} required>
                        <option value="">Seleccione un Usuario</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id} value={usuario.id}>{usuario.nombre}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary me-2" onClick={() => router.push('/gerente/proyectos')}>
                    Asignar Tarea
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => router.push("/gerente/proyectos")}>Cancelar</button>
            </form>
        </div>
    );
}