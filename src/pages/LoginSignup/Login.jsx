import React, { useState } from 'react';
import { icons, goTripData } from '../../assets/index';
import { json, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../../service/goTripService';

const Login = () => {
    const navigate = useNavigate();
  
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setErrorMessage("");
    
      // 🔹 Credenciales hardcodeadas
      const CREDENCIALES_VALIDAS = {
        username: "usuarioPrueba",
        password: "123456"
      };

      console.log("Estoy andando");
    
      // 🔹 Si las credenciales son las hardcodeadas, redirige sin llamar al backend
      if (username === CREDENCIALES_VALIDAS.username && password === CREDENCIALES_VALIDAS.password) {
        localStorage.setItem("userName", "Usuario de Prueba");
        localStorage.setItem("isNoVidente", "false");
        window.dispatchEvent(new Event("storage"));
        console.log("Entre");
        navigate("/opciones");
        setLoading(false);
        return; // 🔹 Detiene la ejecución aquí para evitar llamar al backend
      }
    
      // 🔹 Si no son las credenciales hardcodeadas, sigue con el flujo normal
      try {
        const response = await loginUsuario(username, password);
    
        if (response.success) {
          localStorage.setItem("userName", response.userName);
          localStorage.setItem("isNoVidente", response.isNoVidente.toString());
          window.dispatchEvent(new Event("storage"));
    
          navigate("/opciones");
        } else {
          setErrorMessage("Credenciales inválidas. Intenta de nuevo.");
        }
      } catch (error) {
        setErrorMessage("Error al conectar con el servidor. Intenta más tarde.");
      }
    
      setLoading(false);
    };
    
      
  
    return (
      <main className="place-content-center grid bg-background-navy w-full h-screen" role="main">
        <div className="flex items-center bg-background-white lg:pr-0 pl-12 rounded-3xl">
          <div className="flex flex-col justify-evenly items-start gap-4 py-10 lg:py-0 min-w-[300px]">
            <img src={icons.gotripLogo} className="h-12 object-contain" alt="GoTrip logo" />
            <span className="text-gray-700 text-xl" aria-live="polite">
              ¡Bienvenido!
            </span>
            <h1 className="font-bold text-primary-blue text-4xl">Iniciar sesión</h1>
  
            {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
  
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-labelledby="form-title">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm" htmlFor="username">
                  Nombre de usuario
                </label>
                <input
                  id="username"
                  className="focus:bg-primary-lightBlue p-[6px] rounded-lg outline-none transition-all"
                  type="text"
                  aria-required="true"
                  aria-label="Introduce tu correo"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  className="focus:bg-primary-lightBlue p-[6px] rounded-lg outline-none transition-all"
                  type="password"
                  aria-required="true"
                  aria-label="Introduce tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                className="bg-primary-blue hover:bg-primary-lightBlue mt-3 p-2 rounded-lg font-semibold text-black transition-all"
                type="submit"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Iniciar sesión"}
              </button>
            </form>
  
            <p>
              ¿No tienes cuenta?
              <Link to={"/registro"} className="hover:text-primary-darkBlue transition cursor-pointer">
                <strong> Registrarse.</strong>
              </Link>
            </p>
          </div>
          <img
            className="hidden lg:block bg-primary-lightBlue pr-4 rounded-3xl h-[600px]"
            src={icons.globeCouple}
            alt="Imagen de pareja viajando por el mundo"
          />
        </div>
      </main>
    );
  };
  
  export default Login;