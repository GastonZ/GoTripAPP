import React, { useState } from "react";
import { icons } from "../../assets";
import { Link, useNavigate } from "react-router-dom";
import { createUsuario } from '../../service/goTripService'

const SignUp = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [blind, setBlind] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirmSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const newUser = {
      userName: email,
      password,
      email,
      telefono,
      fechaNacimiento: fechaNacimiento,
      state: 1,
      isNoVidente: blind,
    };

    try {
      const response = await createUsuario(newUser);

      if (response) {
        alert("Registro exitoso");
        navigate("/iniciar"); // Redirigir a login
      } else {
        setErrorMessage("No se pudo registrar. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setErrorMessage("Hubo un error al registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="place-content-center grid bg-background-navy w-full h-screen" role="main">
      <div className="flex items-center bg-background-white pr-0 lg:pr-12 rounded-3xl">
        <img
          className="hidden lg:block bg-primary-lightBlue pl-4 rounded-3xl h-[700px]"
          src={icons.globeCouple}
          alt="Imagen de pareja viajando por el mundo"
        />
        <div className="flex flex-col justify-evenly items-center gap-2 py-10 lg:py-0 min-w-[300px]">
          <img src={icons.gotripLogo} className="h-12 object-contain" alt="GoTrip logo" />
          <span className="text-gray-700 text-xl" aria-live="polite">
            ¡Bienvenido!
          </span>
          <h1 className="font-bold text-primary-blue text-4xl">Registrarse</h1>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <form className="flex flex-col gap-4" aria-labelledby="form-title" onSubmit={handleConfirmSignup}>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm" htmlFor="email">Email</label>
              <input onChange={(e) => setEmail(e.target.value)} id="email" className="focus:bg-primary-lightBlue p-[6px] rounded-lg outline-none" type="email" required />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm" htmlFor="password">Contraseña</label>
              <input onChange={(e) => setPassword(e.target.value)} id="password" className="focus:bg-primary-lightBlue p-[6px] rounded-lg outline-none" type="password" required />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm" htmlFor="dni">DNI</label>
              <input onChange={(e) => setDni(e.target.value)} id="dni" className="focus:bg-primary-lightBlue p-[6px] rounded-lg outline-none" type="text" required />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm" htmlFor="telefono">Teléfono</label>
              <input onChange={(e) => setTelefono(e.target.value)} id="telefono" className="focus:bg-primary-lightBlue p-[6px] rounded-lg outline-none" type="text" required />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm" htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <input onChange={(e) => setFechaNacimiento(e.target.value)} id="fechaNacimiento" className="focus:bg-primary-lightBlue p-[6px] rounded-lg outline-none" type="date" required />
            </div>

            <div className="flex gap-2">
              <label htmlFor="view">¿Eres una persona no vidente?</label>
              <input onChange={(e) => setBlind(e.target.checked)} id="view" name="view" type="checkbox" />
            </div>

            <button className="bg-primary-blue hover:bg-primary-lightBlue mt-3 p-2 rounded-lg font-semibold text-black transition-all" type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <p>
            ¿Ya tienes cuenta?
            <Link to={"/iniciar"} className="hover:text-primary-darkBlue transition cursor-pointer">
              <strong> Iniciar sesión.</strong>
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
