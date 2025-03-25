import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";

const CrearProyecto = () => {
    const router = useRouter();
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const validarFechas = () => {
        const hoy = new Date().toISOString().split("T")[0];

        if (fechaInicio && fechaInicio < hoy) {
            Swal.fire("Error", "La fecha de inicio no puede ser menor a la actual", "error");
            return false;
        }

        if (fechaFin && fechaFin <= hoy) {
            Swal.fire("Error", "La fecha de finalización no puede ser igual o menor a la actual", "error");
            return false;
        }

        if (fechaFin && fechaInicio && fechaFin < fechaInicio) {
            Swal.fire("Error", "La fecha de finalización no puede ser menor a la fecha de inicio", "error");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFechas()) return;

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "/api/proyectos",
                {
                    nombre,
                    descripcion,
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            Swal.fire("Éxito", "Proyecto creado correctamente", "success");
            router.push("/gerente/proyectos");
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "No se pudo crear el proyecto", "error");
        }
    };

    return (
        <div className="container mt-5">
            <h1>Crear Proyecto</h1>
            <form onSubmit={handleSubmit} className="card p-4">
                <div className="mb-3">
                    <label className="form-label">Nombre del Proyecto</label>
                    <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha de Inicio</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaInicio}
                        onChange={(e) => {
                            setFechaInicio(e.target.value);
                            if (fechaFin && e.target.value > fechaFin) setFechaFin(""); // Reset si la fechaFin ya no es válida
                        }}
                        required
                        min={new Date().toISOString().split("T")[0]} // No permite fechas pasadas
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha de Fin</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        required
                        min={new Date().toISOString().split("T")[0]} // No permite que la fecha sea menor o igual a hoy
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Crear Proyecto
                </button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => router.push("/gerente/proyectos")}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CrearProyecto;
