import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function TareasAsignadasPage() {
  const router = useRouter();

  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerTareasAsignadas = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/miembro/tareas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Hubo un problema al obtener las tareas asignadas');
        }

        const data = await res.json();
        setTareas(data.tareas);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerTareasAsignadas();
  }, []);

  const handleVolver = () => {
    router.push('/miembros');
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Panel Miembro</h2>
        <ul style={styles.menuList}>
          <li style={styles.menuItem} onClick={handleVolver}>Proyectos</li>
          <li style={{ ...styles.menuItem, fontWeight: 'bold' }}>Tareas</li>
          <li style={styles.menuItem} onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}>
            Cerrar sesiÃ³n
          </li>
        </ul>
      </aside>

      <main style={styles.main}>
        <h1 style={styles.title}>Mis Tareas Asignadas</h1>

        {error && <p style={styles.error}>{error}</p>}

        {tareas.length === 0 && !error && (
          <p>No tienes tareas asignadas actualmente.</p>
        )}

        <div style={styles.tareasGrid}>
          {tareas.map((tarea) => (
            <div key={tarea.id} style={styles.tareaCard}>
              <h3>{tarea.tarea_nombre}</h3>
              <p><strong>Proyecto:</strong> {tarea.proyecto_nombre}</p>
              <p>{tarea.descripcion}</p>
              <p><strong>Estado:</strong> {tarea.estado}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2C3E50',
    color: '#ECF0F1',
    padding: '20px',
  },
  sidebarTitle: {
    marginBottom: '30px',
  },
  menuList: {
    listStyle: 'none',
    padding: 0,
  },
  menuItem: {
    cursor: 'pointer',
    padding: '10px 0',
    borderBottom: '1px solid #34495E',
  },
  main: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#ECF0F1',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  tareasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  tareaCard: {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  error: {
    color: 'red',
  },
};