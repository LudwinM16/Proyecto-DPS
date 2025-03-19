import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditarProyecto() {
    const router = useRouter();
    const { id } = router.query;
    const [proyecto, setProyecto] = useState({
        nombre: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchProyecto();
        }
    }, [id]);

    const fetchProyecto = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/proyectos/${id}`);
            setProyecto(res.data);
        } catch (err) {
            console.error("Error al obtener el proyecto:", err);
            setError("Error al cargar el proyecto.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProyecto((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.put(`/api/proyectos/${id}`, proyecto);
            Swal.fire("Éxito", "Proyecto actualizado correctamente", "success");
            router.push("/gerente/proyectos");
        } catch (err) {
            console.error("Error al actualizar el proyecto:", err);
            Swal.fire("Error", "No se pudo actualizar el proyecto", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center mt-4">Cargando...</p>;
    if (error) return <p className="text-center text-danger mt-4">{error}</p>;

    return (
        <div className="container mt-5">
            <h1>Editar Proyecto</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={proyecto.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        name="descripcion"
                        value={proyecto.descripcion}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha de Inicio</label>
                    <input
                        type="date"
                        className="form-control"
                        name="fecha_inicio"
                        value={proyecto.fecha_inicio}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha de Fin</label>
                    <input
                        type="date"
                        className="form-control"
                        name="fecha_fin"
                        value={proyecto.fecha_fin}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary me-2">
                    Guardar Cambios
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => router.push("/gerente/proyectos")}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}
