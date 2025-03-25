import { useState } from "react";

export default function LoginPage() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(event) {
        event.preventDefault();
        
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre_usuario: nombreUsuario,
                contrasena: contrasena
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            const rolId = data.usuario.rol_id;

            // Redirección segun rol
            switch (rolId) {
                case 1: // Administrador
                    window.location.href = "/admin";
                    break;
                case 2: // Gerente
                    window.location.href = "/gerente";
                    break;
                case 3: // Miembro
                    window.location.href = "/miembros";
                    break;
                default:
                    // Rol no reconocido
                    window.location.href = "../";
                    break;
            }
        } else {
            setError(data.error);
        }
    }

    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-5 shadow-lg" style={{ width: "420px" }}>
          <h2 className="text-center mb-5">Iniciar Sesión</h2>

          {error && (
              <div className="alert alert-danger mb-4" role="alert">
                  {error}
              </div>
          )}

          <form onSubmit={handleLogin}>
              <div className="mb-4">
                  <label htmlFor="nombreUsuario" className="form-label fs-5">
                      Nombre de usuario
                  </label>
                  <input
                      type="text"
                      className="form-control py-2"
                      id="nombreUsuario"
                      placeholder="Ingrese su usuario"
                      value={nombreUsuario}
                      onChange={(e) => setNombreUsuario(e.target.value)}
                      required
                  />
              </div>

              <div className="mb-5">
                  <label htmlFor="contrasena" className="form-label fs-5">
                      Contraseña
                  </label>
                  <input
                      type="password"
                      className="form-control py-2"
                      id="contrasena"
                      placeholder="Ingrese su contraseña"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      required
                  />
              </div>

              <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                      Iniciar sesión
                  </button>
              </div>
          </form>
      </div>
  </div>
    );
}