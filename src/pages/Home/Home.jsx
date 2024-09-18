import React from 'react'
import { icons } from '../../assets'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <main className='bg-background-navy p-8'>
      <section className='flex flex-col justify-center items-center gap-6 h-screen'>
        <h1 className='text-5xl text-center'>¡Bienvenidos a Tucumán!</h1>
        <div className='flex justify-center items-center pt-8'>
          <img className='rounded-full w-[500px] h-[500px] object-cover' src={icons.tucuman} alt="Imagén ilustrativa de Tucumán" />
        </div>
        <button className='bg-primary-blue hover:bg-primary-lightBlue px-4 py-2 rounded-xl font-semibold transition-all'>Iniciar sesión</button>
        <p>
          ¿No te encuentras registrado?
          <Link to={'/registro'} className='hover:text-primary-darkBlue transition cursor-pointer'>
            <strong> Ingresa aquí.</strong>
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Home