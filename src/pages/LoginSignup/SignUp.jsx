import React, { useState } from 'react';
import { icons } from '../../assets';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [surname, setSurname] = useState('');
    const [dni, setDni] = useState('');
    const [blind, setBlind] = useState(false)

    const handleConfirmSignup = (e) => {
        e.preventDefault()

        const newUser = {
            name, email, password, surname, dni, blind
        };

        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers))

        navigate('/iniciar')
    }

    return (
        <main className='place-content-center grid bg-background-navy w-full h-screen' role="main">
            <div className='flex items-center bg-background-white pr-0 lg:pr-12 rounded-3xl'>
                <img
                    className='lg:block hidden bg-primary-lightBlue bg-red pl-4 rounded-3xl h-[700px]'
                    src={icons.globeCouple}
                    alt="Imagen de pareja viajando por el mundo"
                />
                <div className='flex flex-col justify-evenly items-center gap-2 py-10 lg:py-0 min-w-[300px]'>
                    <img src={icons.gotripLogo} className='h-12 object-contain' alt="GoTrip logo" />
                    <span className='text-gray-700 text-xl' aria-live="polite">¡ Bienvenido !</span>
                    <h1 className='font-bold text-4xl text-primary-blue'>Registrarse</h1>
                    <form className='flex flex-col gap-4' aria-labelledby="form-title" onSubmit={handleConfirmSignup}>
                        <div className='flex flex-col gap-2'>
                            <label className='font-bold text-sm' htmlFor="email">Email</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                className='focus:bg-primary-lightBlue p-[6px] rounded-lg transition-all outline-none'
                                type="email"
                                name="email"
                                aria-required="true"
                                aria-label="Introduce tu correo electrónico"
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='font-bold text-sm' htmlFor="password">Contraseña</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                className='focus:bg-primary-lightBlue p-[6px] rounded-lg transition-all outline-none'
                                type="password"
                                name="password"
                                aria-required="true"
                                aria-label="Introduce tu contraseña"
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='font-bold text-sm' htmlFor="name">Nombre</label>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                id="name"
                                className='focus:bg-primary-lightBlue p-[6px] rounded-lg transition-all outline-none'
                                type="text"
                                name="name"
                                aria-required="true"
                                aria-label="Introduce tu nombre"
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='font-bold text-sm' htmlFor="surname">Apellido</label>
                            <input
                                onChange={(e) => setSurname(e.target.value)}
                                id="surname"
                                className='focus:bg-primary-lightBlue p-[6px] rounded-lg transition-all outline-none'
                                type="text"
                                name="surname"
                                aria-required="true"
                                aria-label="Introduce tu apellido"
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='font-bold text-sm' htmlFor="dni">DNI</label>
                            <input
                                onChange={(e) => setDni(e.target.value)}
                                id="dni"
                                className='focus:bg-primary-lightBlue p-[6px] rounded-lg transition-all outline-none'
                                type="text"
                                name="dni"
                                aria-required="true"
                                aria-label="Introduce tu dni"
                                required
                            />
                        </div>
                        <div className='flex gap-2'>
                            <label htmlFor="">¿ Eres una persona no vidente ?</label>
                            <input onChange={(e) => setBlind(e.target.checked)} id='view' name='view' aria-label='¿ Eres una persona no vidente ?' type='checkbox' />
                        </div>
                        <button
                            className='bg-primary-blue hover:bg-primary-lightBlue mt-3 p-2 rounded-lg font-semibold text-black transition-all'
                            aria-label="Iniciar sesión"
                            type="submit"
                        >
                            Registrarse
                        </button>
                    </form>
                    <p>
                        ¿Ya tienes cuenta?
                        <Link to={'/iniciar'} className='hover:text-primary-darkBlue transition cursor-pointer'>
                            <strong> Iniciar sesión.</strong>
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default SignUp;