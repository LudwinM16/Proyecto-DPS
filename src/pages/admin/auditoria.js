import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import jwt from "jsonwebtoken";
import Swal from "sweetalert2";
import * as XLSX from "xlsx"; //biblioteca para exporta a excel
import { saveAs } from "file-saver";

//Componente principal
export default function AuditoriaPanel() {
  const router = useRouter();
  const [actividades, setActividades] = useState([]);
  const [page, setPage] = useState(1);//página actual para paginación
  const [totalPages, setTotalPages] = useState(1);//total páginas disponibles
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const limit = 10;//registros para mostrar por página

  //obtención de las actividades desde la API
  const fetchActividades = async (token) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`/api/actividad?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //Evalua y almacena la cantidad de resultados y páginas
      setActividades(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Error al obtener auditoría:", err);
      setError("Error al cargar auditoría.");
    } finally {
      setLoading(false);
    }
  };

  //Validar token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      //si el token no es válido o no existe, redirige al inicio
      router.push("../");
      return;
    }

    const user = jwt.decode(token);
    setUsuario(user);

    if (!user || user.rol !== 1) {
      Swal.fire("Acceso denegado", "No tienes permisos para ver esta página", "error");
      router.push("/dashboard");
      return;
    }

    fetchActividades(token);
  }, [page, router]);

  // Función para exportar las actividades a un archivo Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      actividades.map((act) => ({
        ID: act.id,
        Descripción: act.descripcion,
        Usuario: act.usuario_nombre,
        Fecha: new Date(act.fecha).toLocaleString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Auditoría");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Auditoria_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

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

  if (loading) return <p className="text-center mt-4">Cargando actividades...</p>;

  if (error) return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Panel de Auditoría</h1>
        <div>
          <button onClick={() => router.push('/admin')} className="btn btn-secondary me-2">
            ← Volver
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Tarjeta principal con la tabla */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Registro de Actividades</span>
          <button onClick={exportToExcel} className="btn btn-success">
            Exportar a Excel
          </button>
        </div>

        <div className="card-body">
          {/* Tabla de actividades */}
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Usuario</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {actividades.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay registros de actividad
                  </td>
                </tr>
              ) : (
                actividades.map((actividad) => (
                  <tr key={actividad.id}>
                    <td>{actividad.id}</td>
                    <td>{actividad.descripcion}</td>
                    <td>{actividad.usuario_nombre}</td>
                    <td>{new Date(actividad.fecha).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-secondary"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Anterior
            </button>

            <span>
              Página {page} de {totalPages}
            </span>

            <button
              className="btn btn-secondary"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
