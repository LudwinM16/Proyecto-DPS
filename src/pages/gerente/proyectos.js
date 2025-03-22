import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import jwt from "jsonwebtoken";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ProyectosPanel() {
  const router = useRouter();
  const [proyectos, setProyectos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const limit = 10;

  const fetchProyectos = async (token) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`/api/proyectos?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProyectos(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.data.pagination ? res.data.pagination.totalPages : 1);
    } catch (err) {
      console.error("Error al obtener proyectos:", err);
      setError("Error al cargar proyectos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === 'undefined') {
      router.push("/login");
      return;
    }

    const user = jwt.decode(token);
    setUsuario(user);

    if (!user || (user.rol !== 1 && user.rol !== 2)) {
      Swal.fire("Acceso denegado", "No tienes permisos para ver esta página", "error");
      router.push("/dashboard");
      return;
    }

    fetchProyectos(token);
  }, [page, router]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
        proyectos.map((proyecto) => ({
          ID: proyecto.id,
          Nombre: proyecto.nombre,
          Descripción: proyecto.descripcion,
          Estado: proyecto.estado || "No asignado",
          FechaInicio: new Date(proyecto.fecha_inicio).toLocaleDateString(),
          FechaFin: new Date(proyecto.fecha_fin).toLocaleDateString(),
        }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Proyectos");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Proyectos_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el proyecto definitivamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`/api/proyectos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Eliminado", "Proyecto eliminado exitosamente", "success");
        fetchProyectos(token);
      } catch (err) {
        console.error("Error al eliminar proyecto:", err);
        Swal.fire("Error", "No se pudo eliminar el proyecto", "error");
      }
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando proyectos...</p>;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;

  return (
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Panel de Proyectos</h1>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={() => router.push('/gerente/crear')}>Crear Proyectos</button>
            <button className="btn btn-info" onClick={() => router.push('/gerente/asignar')}>Asignar tareas</button>
            <button onClick={() => router.push('/admin')} className="btn btn-secondary">← Volver</button>
            <button onClick={exportToExcel} className="btn btn-success">Exportar a Excel</button>
            <button onClick={() => { localStorage.removeItem("token"); router.push("/login"); }} className="btn btn-danger">Cerrar sesión</button>
          </div>
        </div>

        {/* Tabla de proyectos */}
        <table className="table table-striped">
          <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {proyectos.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No hay proyectos registrados</td></tr>
          ) : (
              proyectos.map((proyecto) => (
                  <tr key={proyecto.id}>
                    <td>{proyecto.id}</td>
                    <td>{proyecto.nombre}</td>
                    <td>{proyecto.descripcion}</td>
                    <td>{proyecto.estado || "No asignado"}</td>
                    <td>{new Date(proyecto.fecha_inicio).toLocaleDateString()}</td>
                    <td>{new Date(proyecto.fecha_fin).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => router.push(`/gerente/editar/${proyecto.id}`)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(proyecto.id)}>Eliminar</button>
                    </td>
                  </tr>
              ))
          )}
          </tbody>
        </table>
      </div>
  );
}
