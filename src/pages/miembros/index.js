import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const MiembroTareas = () => {
  const router = useRouter();
  const [tareas, setTareas] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [porcentajes, setPorcentajes] = useState({});
  const [mostrarComentarios, setMostrarComentarios] = useState({});
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
      const [nombreUsuario, setNombreUsuario] = useState("");
      const [contraseña, setContraseña] = useState("");
      const [rolId, setRolId] = useState(3);
  
      const [usuario, setUsuario] = useState(null);

  useEffect(() => {
     const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No autorizado. Inicia sesión.');
          router.push('/login');
        } else {
          fetchTareas(token);
        }
      }, []);

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
//Lista las tareas disponibles para el usuario en sesión
  const fetchTareas = async (token) => {
    try {
      const response = await fetch('/api/miembro/tareas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error al obtener las tareas');
        return;
      }

      // Inicializamos mostrarComentarios en false para cada tarea
      const estadoMostrarComentarios = {};
      data.tareas.forEach((tarea) => {
        estadoMostrarComentarios[tarea.id] = false;
      });

      setMostrarComentarios(estadoMostrarComentarios);
      setTareas(data.tareas);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      toast.error('Error en la solicitud al obtener tareas');
    }
  };

  const handleActualizarTarea = async (tareaId) => {
    const comentario = comentarios[tareaId];
    const nuevoPorcentaje = porcentajes[tareaId];

    if (nuevoPorcentaje === null || nuevoPorcentaje === '' || isNaN(nuevoPorcentaje)) {
      toast.error('Porcentaje inválido');
      return;
    }

    if (!comentario || comentario.trim() === '') {
      toast.error('El comentario es obligatorio');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/miembro/tareas/${tareaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          porcentaje: nuevoPorcentaje,
          comentario: comentario,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error PATCH:', data);
        toast.error(data.error || 'Error al actualizar la tarea y agregar el comentario');
        return;
      }

      toast.success(data.message || 'Tarea actualizada y comentario agregado');

      // Limpiar inputs después de actualizar
      setComentarios((prev) => ({ ...prev, [tareaId]: '' }));
      setPorcentajes((prev) => ({ ...prev, [tareaId]: '' }));

      // Recargar tareas para actualizar el estado actual
      fetchTareas(token);
    } catch (error) {
      console.error('Error en la solicitud PATCH:', error);
      toast.error('Error en la solicitud al actualizar la tarea');
    }
  };

  const toggleComentarios = (tareaId) => {
    setMostrarComentarios((prev) => ({
      ...prev,
      [tareaId]: !prev[tareaId],
    }));
  };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Panel de Usuarios</h1>
                <div>
                    {usuario && (
                        <span className="me-3">
                            Bienvenido, <strong>{usuario.nombre_usuario}</strong>
                        </span>
                    )} 
                    
                    <button onClick={handleLogout} className="btn btn-danger">
                        Cerrar sesión
                    </button>
                </div>
            </div>
             <div style={styles.container}>
                  <h1 style={styles.title}>Mis Tareas</h1>
            
                  {tareas.length === 0 ? (
                    <p>No tienes tareas asignadas.</p>
                  ) : (
                    tareas.map((tarea) => (
                      <div key={tarea.id} style={styles.tareaCard}>
                        <h3>{tarea.nombre}</h3>
                        <p><strong>Descripción:</strong> {tarea.descripcion}</p>
                        <p><strong>Estado:</strong> {tarea.estado}</p>
                        <p><strong>Porcentaje de avance:</strong> {tarea.porcentaje_avance}%</p>
                        <p><strong>Proyecto:</strong> {tarea.proyecto_nombre}</p>
            
                        <div style={styles.formGroup}>
                          <label htmlFor={`comentario-${tarea.id}`}>Comentario:</label>
                          <textarea
                            id={`comentario-${tarea.id}`}
                            value={comentarios[tarea.id] || ''}
                            onChange={(e) =>
                              setComentarios({ ...comentarios, [tarea.id]: e.target.value })
                            }
                            placeholder="Agrega un comentario..."
                            style={styles.textarea}
                          />
                        </div>
            
                        <div style={styles.formGroup}>
                          <label htmlFor={`porcentaje-${tarea.id}`}>Nuevo Porcentaje (%):</label>
                          <input
                            type="number"
                            id={`porcentaje-${tarea.id}`}
                            value={porcentajes[tarea.id] || ''}
                            onChange={(e) =>
                              setPorcentajes({ ...porcentajes, [tarea.id]: e.target.value })
                            }
                            min="0"
                            max="100"
                            style={styles.input}
                          />
                        </div>
            
                        <button
                          style={styles.button}
                          onClick={() => handleActualizarTarea(tarea.id)}
                        >
                          Actualizar Tarea
                        </button>
            
                        <button
                          style={styles.secondaryButton}
                          onClick={() => toggleComentarios(tarea.id)}
                        >
                          {mostrarComentarios[tarea.id] ? 'Ocultar Comentarios' : 'Mostrar Comentarios'}
                        </button>
            
                        {mostrarComentarios[tarea.id] && (
                          <div style={styles.comentariosContainer}>
                            <h4>Comentarios anteriores:</h4>
                            {tarea.comentarios && tarea.comentarios.length > 0 ? (
                              tarea.comentarios.map((comentario) => (
                                <div key={comentario.id_comentario} style={styles.comentario}>
                                  <p><strong>Comentario:</strong> {comentario.comentario}</p>
                                  <p><strong>Porcentaje:</strong> {comentario.porcentaje}%</p>
                                </div>
                              ))
                            ) : (
                              <p>No hay comentarios aún.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
            
                  <ToastContainer />
                </div>
        </div>
          
        
    );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  tareaCard: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#0070f3',
    color: '#fff',
    padding: '0.6rem 1.2rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  secondaryButton: {
    backgroundColor: '#555',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  comentariosContainer: {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    marginTop: '1rem',
    borderRadius: '5px',
  },
  comentario: {
    paddingBottom: '1rem',
    borderBottom: '1px solid #eee',
    marginBottom: '1rem',
  },
};


export default MiembroTareas;
