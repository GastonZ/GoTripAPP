import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ButtonOptions from '../../components/ButtonOptions';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';

const GoCalendar = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState([new Date(), new Date()]);
  const [steps, setSteps] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [iframeUrl, setIframeUrl] = useState('');

  // Coordinates
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

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('selectedItems'));
    if (savedItems) setSelectedItems(savedItems);
  }, []);

  const handleNextStep = () => {
    if (steps === 0) {
      localStorage.setItem('selectedDates', JSON.stringify(value));
    }

    if (steps === 1) {
      localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    }

    setSteps(steps + 1);
  };

  const handlePreviusStep = () => {
    setSteps(steps - 1);
  };

  const handleCheckboxChange = (item) => {
    const updatedItems = selectedItems.includes(item)
      ? selectedItems.filter(i => i !== item)
      : [...selectedItems, item];

    setSelectedItems(updatedItems);
  };

  const handleConfirmTrip = () => {
    localStorage.removeItem('selectedDates');
    localStorage.removeItem('selectedItems');

    const existingTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
    const newTrip = { date: value, travelPoints: selectedItems };
    const updatedTrips = [...existingTrips, newTrip];
    localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
    navigate('/opciones');
  };

  const generateIframeUrl = () => {
    const baseUrl = 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyAvBg2_LvfISOBrPQI5gIVNkF_65ypu-8k';
    const origin = 'current+location';

    const selectedCoordinates = selectedItems.map(item => {
      for (const category of locationCategories) {
        const place = category.places.find(place => place.name === item);
        if (place) return place.coordinates;
      }
      return null;
    }).filter(Boolean);

    const waypoints = selectedCoordinates.slice(0, -1).join('|');
    const finalDestination = selectedCoordinates[selectedCoordinates.length - 1];
    return `${baseUrl}&origin=${origin}&destination=${finalDestination}&waypoints=${waypoints}&mode=driving`;
  };

  useEffect(() => {
    if (steps === 3 && selectedItems.length > 0) {
      const url = generateIframeUrl();
      setIframeUrl(url);
    }
  }, [steps, selectedItems]);

  return (
    <main>
      <div className='flex justify-center bg-gray-400 pt-4'>
        <div className={`${steps === 0 ? 'bg-background-navy' : ''} p-6 text-3xl rounded-t-lg relative`}>
          <div className={`${steps !== 0 ? 'hidden' : 'block'} top-1 left-1 absolute bg-primary-blue rounded-full w-6 h-6 text-center text-sm`}>1</div>
          <p className='text-center'>
            Seleccionar fechas
          </p>
        </div>
        <div className={`${steps === 1 ? 'bg-background-navy' : ''} p-6 text-3xl rounded-t-lg relative`}>
          <div className={`${steps !== 1 ? 'hidden' : 'block'} top-1 left-1 absolute bg-primary-blue rounded-full w-6 h-6 text-center text-sm`}>2</div>
          <p className='text-center'>
            Categorías
          </p>
        </div>
        <div className={`${steps === 2 ? 'bg-background-navy' : ''} p-6 text-3xl rounded-t-lg relative`}>
          <div className={`${steps !== 2 ? 'hidden' : 'block'} top-1 left-1 absolute bg-primary-blue rounded-full w-6 h-6 text-center text-sm`}>3</div>
          <p className='text-center'>
            Destinos seleccionados
          </p>
        </div>
        <div className={`${steps === 3 ? 'bg-background-navy' : ''} p-6 text-3xl rounded-t-lg relative`}>
          <div className={`${steps !== 3 ? 'hidden' : 'block'} top-1 left-1 absolute bg-primary-blue rounded-full w-6 h-6 text-center text-sm`}>4</div>
          <p className='text-center'>
            Recorrido generado
          </p>
        </div>
      </div>
      <div className='flex justify-center items-center gap-4 bg-background-navy p-4 min-h-screen'>
        {steps === 0 && (
          <>
            <div className='flex flex-col items-start gap-4 w-[400px]'>
              {/*               <h1 className='text-4xl text-gray-800'>Seleccionar fechas</h1> */}
              <div className='flex flex-col gap-1'>
                <p>Fecha de inicio</p>
                <span className='bg-primary-lightBlue p-2 rounded-sm text-3xl'>
                  {value[0].getDate()}/{value[0].getMonth()}/{value[0].getFullYear()}
                </span>
                <p>Fecha de finalización</p>
                <span className='bg-primary-lightBlue p-2 rounded-sm text-3xl'>
                  {value[1].getDate()}/{value[1].getMonth()}/{value[1].getFullYear()}
                </span>
              </div>
              <ButtonOptions onClick={handleNextStep} text={'Siguiente'} />
            </div>
            <div className='bg-primary-blue p-6 border-none rounded-xl'>
              <Calendar
                className='bg-primary-lightBlue border-none rounded-xl w-full h-[400px] transition-all'
                onChange={setValue}
                value={value}
                selectRange={true}
              />
            </div>
          </>
        )}

        {steps === 1 && (
          <>
            <div className="flex flex-col justify-center items-center">
              <div className='flex justify-between items-center py-6 w-full'>
                <ArrowLeftCircleIcon className='cursor-pointer' onClick={handlePreviusStep} height={24} width={24} />
                <div className="mt-6">
                  <ButtonOptions onClick={handleNextStep} text={'Ver puntos seleccionados'} />
                </div>
              </div>
              <div className="flex flex-wrap justify-around gap-4 rounded-lg">
                {locationCategories.map(({ category, places }) => (
                  <div key={category} className="flex-grow bg-gray-200 p-4 rounded-lg w-[350px] max-h-[500px] overflow-y-auto">
                    <h2 className="mb-4 font-semibold text-xl">{category}</h2>
                    <ul>
                      {places.map(({ name }) => (
                        <li key={name} className="flex justify-between items-center bg-white mb-2 p-2 rounded-md">
                          <span>{name}</span>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="form-checkbox"
                              onChange={() => handleCheckboxChange(name)}
                              checked={selectedItems.includes(name)}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </div>
          </>
        )}

        {steps === 2 && (
          <>
            <div className='flex flex-wrap gap-4'>
              <div className='flex flex-col gap-6'>
                <ArrowLeftCircleIcon className='cursor-pointer' onClick={handlePreviusStep} height={24} width={24} />
                {/*                 <h2 className='text-3xl'>Destinos Seleccionados</h2> */}
                <div className='flex flex-col gap-4 bg-primary-lightBlue p-8 rounded-md'>
                  {selectedItems.map(item => (
                    <span key={item} className='bg-primary-blue px-6 py-2 rounded-md text-black'>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className='flex flex-col justify-center gap-4'>
                <ButtonOptions onClick={handlePreviusStep} text={'Agregar otro punto turístico'} />
                <ButtonOptions onClick={handleNextStep} text={'Confirmar plan de viaje'} />
              </div>
            </div>
          </>
        )}

        {steps === 3 && (
          <>
            <div className='flex flex-wrap gap-4'>
              <div className='flex flex-col gap-6'>
                <ArrowLeftCircleIcon className='cursor-pointer' onClick={handlePreviusStep} height={24} width={24} />
                {/*                 <h2 className='text-3xl'>Recorrido generado</h2> */}
                <div className='flex flex-col gap-4 bg-primary-lightBlue p-8 rounded-md'>
                  {selectedItems.map(item => (
                    <span key={item} className='bg-primary-blue px-6 py-2 rounded-md text-black'>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className='flex flex-col justify-center gap-4'>
                {iframeUrl ? (
                  <iframe
                    src={iframeUrl}
                    width="600"
                    height="450"
                    allowFullScreen=""
                    loading="lazy"
                    className='border-0 rounded-md'
                  ></iframe>
                ) : (
                  <div>Generando mapa...</div>
                )}
                <ButtonOptions onClick={handleConfirmTrip} text={'Guardar plan de viaje'} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default GoCalendar;
