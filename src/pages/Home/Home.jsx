import React, { useEffect } from 'react'
import { icons } from '../../assets'
import { Link } from 'react-router-dom'

const Home = () => {

  const locationCategories = [
    {
      category: 'Museos',
      places: [
        { name: 'Museo Casa Histórica de la Independencia', coordinates: '-26.8363, -65.2036' },
        { name: 'Museo Miguel Lillo de Ciencias Naturales', coordinates: '-26.8329, -65.2084' },
        { name: 'Museo Folclórico General Manuel Belgrano', coordinates: '-26.8364, -65.2044' },
        { name: 'Casa de Gobierno', coordinates: '-26.8357, -65.2025' },
        { name: 'Plaza Independencia', coordinates: '-26.8349, -65.2042' },
      ],
    },
    {
      category: 'Iglesias',
      places: [
        { name: 'Iglesia San Francisco', coordinates: '-26.8371, -65.2056' },
        { name: 'Catedral de San Miguel de Tucumán', coordinates: '-26.8342, -65.2030' },
        { name: 'Iglesia Nuestra Señora de la Merced', coordinates: '-26.8321, -65.2051' },
      ],
    },
    {
      category: 'Entretenimiento',
      places: [
        { name: 'Teatro San Martín', coordinates: '-26.8352, -65.2083' },
        { name: 'Teatro Alberdi', coordinates: '-26.8283, -65.2058' },
        { name: 'Teatro Mercedes Sosa', coordinates: '-26.8354, -65.2045' },
        { name: 'Teatro Municipal Rosita Ávila', coordinates: '-26.8179, -65.2419' },
        { name: 'Cine Atlas Vía 24', coordinates: '-26.8284, -65.2051' },
        { name: 'Sunstar Cinemas', coordinates: '-26.8127, -65.2178' },
      ],
    },
    {
      category: 'Bares y Restaurantes',
      places: [
        { name: 'Espacio Juntarnos (Bar Inclusivo)', coordinates: '-26.8302, -65.2055' },
        { name: 'La Pizzada', coordinates: '-26.8298, -65.2046' },
        { name: 'Il Postino', coordinates: '-26.8183, -65.2212' },
        { name: 'Filipo', coordinates: '-26.8304, -65.2052' },
        { name: 'Mi Nueva Estancia', coordinates: '-26.8297, -65.2078' },
        { name: 'Oliver Brown', coordinates: '-26.8114, -65.2153' },
        { name: 'Sir Harris', coordinates: '-26.8329, -65.2065' },
        { name: 'Patagonia (Bar Cervecero)', coordinates: '-26.8144, -65.2187' },
        { name: 'Beans 25', coordinates: '-26.8245, -65.2044' },
        { name: 'El Cardón', coordinates: '-26.8284, -65.2025' },
        { name: 'Leno', coordinates: '-26.8247, -65.2046' },
        { name: 'Ohana Restobar', coordinates: '-26.8081, -65.2761' },
        { name: 'Il Postino Yerba Buena', coordinates: '-26.8097, -65.2800' },
        { name: 'Johnny B Good', coordinates: '-26.8115, -65.2528' },
        { name: 'Bar Irlanda', coordinates: '-26.8126, -65.2541' },
        { name: 'Bar Latino (Paseo de las Americas)', coordinates: '-26.8121, -65.2544' },
        { name: 'Güemes Restobar', coordinates: '-26.8091, -65.2770' },
        { name: 'Brutto Pizza & Craft Beer', coordinates: '-26.8117, -65.2564' },
        { name: 'Pizzería El Árabe', coordinates: '-26.8113, -65.2539' },
        { name: 'Frida (Cocina Mexicana)', coordinates: '-26.8110, -65.2557' },
        { name: 'El Alto (Carnes y Parrilla)', coordinates: '-26.8109, -65.2559' },
        { name: 'Cerveza Patagonia Yerba Buena', coordinates: '-26.8124, -65.2537' },
        { name: 'Sushifeel Yerba Buena', coordinates: '-26.8118, -65.2542' },
        { name: 'Taco Bar (Cocina Tex-Mex)', coordinates: '-26.8120, -65.2548' },
        { name: 'Don Pepe', coordinates: '-26.8331, -65.2090' },
        { name: 'Los Eléctricos', coordinates: '-26.8295, -65.2104' },
        { name: 'Tutti', coordinates: '-26.8280, -65.2098' },
        { name: 'Santo Pecado', coordinates: '-26.8350, -65.2090' },
        { name: 'La Negra Restaurante', coordinates: '-26.8290, -65.2088' },
        { name: 'Mora Bistro Argentino', coordinates: '-26.8327, -65.2021' },
        { name: 'Casa Noujaim (Comida Árabe)', coordinates: '-26.8309, -65.2048' },
      ],
    },
    {
      category: 'Naturaleza',
      places: [
        { name: 'Parque Avellaneda', coordinates: '-26.8264, -65.2349' },
        { name: 'Parque Guillermina', coordinates: '-26.8027, -65.2365' },
        { name: 'Parque 9 de Julio', coordinates: '-26.8297, -65.1954' },
        { name: 'Plaza Urquiza', coordinates: '-26.8226, -65.2068' },
        { name: 'Plaza San Martín', coordinates: '-26.8365, -65.2135' },
        { name: 'Plaza Alberdi', coordinates: '-26.8255, -65.2024' },
        { name: 'Plaza Belgrano', coordinates: '-26.8350, -65.1999' },
        { name: 'Parapente en loma bola', coordinates: '-26.7993, -65.3506' },
        { name: 'Dique La Angostura', coordinates: '-26.9186, -65.6945' },
        { name: 'Reserva Experimental Horco Molle', coordinates: '-26.8003, -65.3158' },
        { name: 'Yungas de Tucumán (Reserva de la Biosfera)', coordinates: '-26.8100, -65.3517' },
        { name: 'Trekking en la Quebrada de Lules', coordinates: '-26.8852, -65.3428' },
        { name: 'Cabalgatas en Tafí del Valle', coordinates: '-26.8547, -65.7095' },
        { name: 'Rafting en el Río Los Sosa', coordinates: '-26.8500, -65.6785' },
        { name: 'Mountain Bike en San Pedro de Colalao', coordinates: '-26.3103, -65.4981' },
        { name: 'Caminata en la Reserva Natural Aguas Chiquitas', coordinates: '-26.7051, -65.2837' },
        { name: 'Canopy en Raco', coordinates: '-26.7328, -65.3761' },
      ],
    },
    {
      category: 'Imperdibles',
      places: [
        { name: 'San Javier', coordinates: '-26.7928, -65.3611' },
        { name: 'El Cadillal', coordinates: '-26.6066, -65.2062' },
        { name: 'San Pedro de Colalao', coordinates: '-26.3103, -65.4981' },
        { name: 'Tafí del Valle', coordinates: '-26.8547, -65.7095' },
        { name: 'Amaicha del Valle', coordinates: '-26.5861, -65.9183' },
        { name: 'Famaillá', coordinates: '-27.0557, -65.4031' },
        { name: 'Simoca', coordinates: '-27.2693, -65.3553' },
        { name: 'El Mollar', coordinates: '-26.9252, -65.7356' },
        { name: 'Concepción', coordinates: '-27.3436, -65.5959' },
        { name: 'Ciudad Sagrada de Quilmes', coordinates: '-26.4667, -66.0500' },
        { name: 'Ruinas Jesuíticas de Lules', coordinates: '-26.9421, -65.3267' },
      ],
    },
  ];

  const userData = [
    { "email": "gaston@gmail.com", "password": "test1234", "name": "Gaston", "surname": "Zappulla", "dni": "40000000", "blind": false },
    { "email": "tamara@gmail.com", "password": "test1234", "name": "Tamara", "surname": "Abraham", "dni": "40000000", "blind": false },
    { "email": "david@gmail.com", "password": "test1234", "name": "David", "surname": "Martinez", "dni": "40000000", "blind": true }
  ]

  const currentUserBlind = JSON.parse(localStorage.getItem('userData')) || ''

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('locationCategories'))) {
      console.log('Already exists a locations array')
    } else {
      localStorage.setItem('locationCategories', JSON.stringify(locationCategories));
    }

    if (JSON.parse(localStorage.getItem('users')).length > 0) {
      console.log('Already exists an users array')
    } else {
      localStorage.setItem('users', JSON.stringify(userData));
    }
  }, [])

  return (
    currentUserBlind.blind ?
      <main className='flex flex-col justify-center items-center gap-10 p-4 w-full h-screen'>
        <h1 className='text-7xl text-center'>Bienvenidos a <br />
          TUCUMÁN</h1>
          <div className='flex flex-col gap-4'>
            <button className='bg-primary-blue px-6 py-4 rounded-2xl text-2xl text-white'>Iniciar sesión</button>
            <button className='bg-primary-blue px-6 py-4 rounded-2xl text-2xl text-white'>Regístrate</button>
          </div>
      </main>
      :
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