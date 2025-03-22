import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import Swal from 'sweetalert2';

export default function MantenimientoPanel() {
    const [archivo, setArchivo] = useState(null);
    const [usuario, setUsuario] = useState(null); 
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("../");
        } else {
            const user = jwt.decode(token);
            setUsuario(user); 
            if (!user || user.rol !== 1) {
                Swal.fire("Acceso denegado", "No tienes permisos para ver esta página", "error");
                router.push("/dashboard");
            }
        }
    }, [router]);

    const generarRespaldo = () => {
        window.open('/api/mantenimiento/respaldo', '_blank');
    };

    const subirRespaldo = async () => {
        if (!archivo) return Swal.fire('Advertencia', 'Selecciona un archivo primero', 'warning');

        const formData = new FormData();
        formData.append('archivo', archivo);

        try {
            const res = await axios.post('/api/mantenimiento/restaurar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire('¡Éxito!', res.data.mensaje, 'success');
        } catch (error) {
            console.error('Error al restaurar:', error);
            Swal.fire('Error', 'Error al restaurar la base de datos', 'error');
        }
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

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mantenimiento del Sistema</h1>
                <div>
                    {usuario && (
                        <span className="me-3">
                            Bienvenido, <strong>{usuario.nombre_usuario}</strong>
                        </span>
                    )}
                    <button onClick={() => router.push('/admin')} className="btn btn-secondary me-2">
                        ← Volver
                    </button>
                    <button onClick={handleLogout} className="btn btn-danger">
                        Cerrar sesión
                    </button>
                </div>
            </div>

            <hr />

            {/* Botón Generar Respaldo */}
            <button onClick={generarRespaldo} className="btn btn-primary mb-4">
                Descargar Respaldo de Base de Datos
            </button>

            {/* Subir respaldo */}
            <div className="mb-3">
                <label><b>Subir respaldo para restaurar:</b></label>
                <input
                    type="file"
                    accept=".sql"
                    className="form-control mt-2"
                    onChange={(e) => setArchivo(e.target.files[0])}
                />
            </div>

            <button onClick={subirRespaldo} className="btn btn-danger">
                Restaurar Base de Datos
            </button>
        </div>
    );
}
