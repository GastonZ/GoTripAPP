import React, { useState } from 'react';
import { icons, goTripData } from '../../assets/index';
import { json, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();

    const usersInfoArray = goTripData.users;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const checkCredentials = (email, password) => {
        const user = usersInfoArray.find((user) => user.email === email && user.password === password);
        return user ? true : false;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (checkCredentials(email, password)) {
            const user = usersInfoArray.find((user) => user.email === email && user.password === password);
            setErrorMessage('');
            localStorage.setItem('userData', JSON.stringify({
                email: user.email,
                name: user.name,
                surname: user.surname,
                dni: user.dni,
                blind: user.blind
            }))
            window.location = "/opciones"
        } else {
            setErrorMessage('Invalid email or password.');
        }
    };

    return (
        <main className='place-content-center grid bg-background-navy w-full h-screen' role="main">
            <div className='flex items-center bg-background-white lg:pr-0 pl-12 rounded-3xl'>
                <div className='flex flex-col justify-evenly items-start gap-4 py-10 lg:py-0 min-w-[300px]'>
                    <img src={icons.gotripLogo} className='h-12 object-contain' alt="GoTrip logo" />
                    <span className='text-gray-700 text-xl' aria-live="polite">¡ Bienvenido !</span>
                    <h1 className='font-bold text-4xl text-primary-blue'>Iniciar sesión</h1>

                    <form onSubmit={handleSubmit} className='flex flex-col gap-4' aria-labelledby="form-title">
                        <div className='flex flex-col gap-2'>
                            <label className='font-bold text-sm' htmlFor="email">Email</label>
                            <input
                                id="email"
                                className='focus:bg-primary-lightBlue p-[6px] rounded-lg transition-all outline-none'
                                type="email"
                                name="email"
                                aria-required="true"
                                aria-label="Introduce tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='font-bold text-sm' htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                className='focus:bg-primary-lightBlue p-[6px] rounded-lg transition-all outline-none'
                                type="password"
                                name="password"
                                aria-required="true"
                                aria-label="Introduce tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            className='bg-primary-blue hover:bg-primary-lightBlue mt-3 p-2 rounded-lg font-semibold text-black transition-all'
                            aria-label="Iniciar sesión"
                            type="submit"
                        >
                            Iniciar sesión
                        </button>
                    </form>

                    {errorMessage && (
                        <p className='mt-2 text-red-500'>
                            {errorMessage}
                        </p>
                    )}

                    <p>
                        ¿No tienes cuenta?
                        <Link to={'/registro'} className='hover:text-primary-darkBlue transition cursor-pointer'>
                            <strong> Registrarse.</strong>
                        </Link>
                    </p>
                </div>
                <img
                    className='lg:block hidden bg-primary-lightBlue bg-red pr-4 rounded-3xl h-[600px]'
                    src={icons.globeCouple}
                    alt="Imagen de pareja viajando por el mundo"
                />
            </div>
        </main>
    );
};

export default Login;
