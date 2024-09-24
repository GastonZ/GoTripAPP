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
  const locations = {
    'Cine atlas': '-26.8297549,-65.2134401',
    'Bar 224': '-26.8297453,-65.2134401',
    'Patagonia': '-26.8297209,-65.2211649',
    'Teatro Mercedes Sosa': '-26.8296819,-65.2211649',
  };

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
    const destinations = selectedItems.map(item => locations[item]).join('|');
    const travelMode = 'driving';

    return `${baseUrl}&origin=${origin}&destination=${locations[selectedItems[selectedItems.length - 1]]}&waypoints=${destinations}&mode=${travelMode}`;
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
              <div className="flex flex-wrap space-x-6 p-6 rounded-lg">
                <ArrowLeftCircleIcon className='cursor-pointer' onClick={handlePreviusStep} height={24} width={24} />
                <div className="flex-grow bg-gray-200 p-4 rounded-lg w-[350px] overflow-y-auto">
                  <h2 className="mb-4 font-semibold text-xl">Categorías</h2>
                  <ul>
                    {['Museos', 'Gastronomía', 'Parques y reservas', 'Entretenimiento', 'Vida nocturna', 'Monumentos', 'Compras'].map((category) => (
                      <li key={category} className="flex items-center space-x-2 bg-gray-300 mb-2 p-2 rounded-md">
                        <span className="inline-block bg-gray-400 w-6 h-6"></span>
                        <span className='text-xl'>{category}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-grow bg-gray-200 p-4 rounded-lg">
                  <h2 className="mb-4 font-semibold text-xl">Entretenimiento</h2>
                  <ul>
                    {['Cine atlas', 'Bar 224', 'Patagonia', 'Teatro Mercedes Sosa'].map((item) => (
                      <li key={item} className="flex justify-between items-center bg-white mb-2 p-2 rounded-md">
                        <span>{item}</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            onChange={() => handleCheckboxChange(item)}
                            checked={selectedItems.includes(item)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <ButtonOptions onClick={handleNextStep} text={'Ver puntos seleccionados'} />
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
