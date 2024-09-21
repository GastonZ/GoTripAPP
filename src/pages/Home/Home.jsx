import React from 'react'
import { icons } from '../../assets'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <main className='flex justify-center items-center bg-background-navy p-8 h-screen'>
      <section className='lg:block relative hidden w-1/2'>
        <img className='rounded-full w-[500px] h-[500px] object-cover' src={icons.tucuman} alt="Imágen de Tucumán" />
        <img className='xl:block top-[250px] right-[300px] absolute hidden rounded-full w-[350px] h-[350px] object-cover' src={icons.tucuman} alt="Imágen de Tucumán" />
      </section>
      <section className='flex flex-col justify-center items-center gap-6 h-screen'>
        <h1 className='text-[60px] text-center sm:text-[90px]'>Bienvenidos a <br /> <strong className='uppercase'>Tucumán</strong> </h1>
        <h2 className='text-3xl'>Comenzar a planear tu viaje</h2>
        <button className='bg-primary-blue hover:bg-primary-lightBlue px-7 py-2 rounded-2xl font-medium text-3xl transition-all'>Iniciar sesión</button>
        <p className='text-2xl text-center'>
          ¿No te encuentras registrado?
          <Link to={'/registro'} className='hover:text-primary-darkBlue transition cursor-pointer'>
            <strong className='text-primary-darkBlue'> Ingresa aquí.</strong>
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Home