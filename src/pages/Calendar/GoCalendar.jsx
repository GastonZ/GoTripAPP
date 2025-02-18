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
  const [selectedItemsCoords, setSelectedItemsCoords] = useState([]);
  const [iframeUrl, setIframeUrl] = useState('');

  const [locationCategories, setLocationsCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setLocationsCategories(JSON.parse(localStorage.getItem('locationCategories')))
    const savedItems = JSON.parse(localStorage.getItem('selectedItems'));
    if (savedItems) setSelectedItems(savedItems);
  }, []);

  const handleNextStep = () => {
    if (steps === 0) {
      localStorage.setItem('selectedDates', JSON.stringify(value));
    }

    if (steps === 1 && !selectedCategory) {
      alert('Elige una categoría');
      return;
    }

    if (steps === 2 && selectedItems.length <= 0) {
      alert('Elige al menos un punto turístico');
      return;
    }
    if (steps === 2) {
      localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    }

    setSteps(steps + 1);
  };

  const handlePreviusStep = () => {
    setSteps(steps - 1);
  };

  const handleCheckboxChange = (item, coordinates) => {
    const updatedItems = selectedItems.includes(item)
      ? selectedItems.filter(i => i !== item)
      : [...selectedItems, item];

    setSelectedItems(updatedItems);

    const updatedCoords = selectedItemsCoords.includes(coordinates)
      ? selectedItemsCoords.filter(i => i !== coordinates)
      : [...selectedItemsCoords, coordinates]

    setSelectedItemsCoords(updatedCoords)
  };

  const handleDeletePoint = (item) => {
    const updatedItems = selectedItems.filter(i => i !== item);
    setSelectedItems(updatedItems);
  };

  const handleConfirmTrip = () => {
    localStorage.removeItem('selectedDates');
    localStorage.removeItem('selectedItems');

    const existingTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
    const newTrip = { date: value, travelPoints: selectedItems, coords: selectedItemsCoords };
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
    if (steps === 4 && selectedItems.length > 0) {
      const url = generateIframeUrl();
      setIframeUrl(url);
    }
  }, [steps, selectedItems]);

  return (
    <main>
      <div className='flex md:flex-row flex-col justify-center bg-gray-400 pt-4'>
        <div className={`${steps === 0 ? 'bg-background-navy' : ''} p-6 text-3xl rounded-t-lg relative`}>
          <div className={`${steps !== 0 ? 'hidden' : 'block'} top-1 left-1 absolute bg-primary-blue rounded-full w-6 h-6 text-center text-sm`}>1</div>
          <p className='text-center'>
            Seleccionar fechas
          </p>
        </div>
        <div className={`${steps === 1 ? 'bg-background-navy' : ''} p-6 text-3xl rounded-t-lg relative`}>
          <div className={`${steps !== 1 ? 'hidden' : 'block'} top-1 left-1 absolute bg-primary-blue rounded-full w-6 h-6 text-center text-sm`}>2</div>
          <p className='text-center'>
            Seleccionar categoría
          </p>
        </div>
        <div className={`${steps === 2 ? 'bg-background-navy' : ''} p-6 text-3xl rounded-t-lg relative`}>
          <div className={`${steps !== 2 ? 'hidden' : 'block'} top-1 left-1 absolute bg-primary-blue rounded-full w-6 h-6 text-center text-sm`}>3</div>
          <p className='text-center'>
            Puntos turísticos
          </p>
        </div>
        <div className={`${steps === 3 ? 'bg-background-navy' : ''} p-6 text-3xl rounded-t-lg relative`}>
          <div className={`${steps !== 3 ? 'hidden' : 'block'} top-1 left-1 absolute bg-primary-blue rounded-full w-6 h-6 text-center text-sm`}>4</div>
          <p className='text-center'>
            Destinos seleccionados
          </p>
        </div>
        <div className={`${steps === 4 ? 'bg-background-navy' : ''} p-6 text-3xl rounded-t-lg relative`}>
          <div className={`${steps !== 4 ? 'hidden' : 'block'} top-1 left-1 absolute bg-primary-blue rounded-full w-6 h-6 text-center text-sm`}>5</div>
          <p className='text-center'>
            Recorrido generado
          </p>
        </div>
      </div>
      <div className='flex justify-center gap-4 bg-background-navy p-4 min-h-[90vh]'>
        {steps === 0 && (
          <div>
            <ArrowLeftCircleIcon className='cursor-pointer' onClick={() => navigate('/opciones')} height={24} width={24} />
            <div className='flex items-center'>
              <div className='flex flex-col justify-center items-start gap-4 w-[400px]'>
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
              <div className='flex justify-center bg-primary-blue p-6 border-none rounded-xl h-[500px]'>
                <Calendar
                  className='bg-primary-lightBlue border-none rounded-xl w-full transition-all'
                  onChange={setValue}
                  value={value}
                  selectRange={true}
                />
              </div>
            </div>
          </div>
        )}

        {steps === 1 && (
          <>
            <div className="flex flex-col">
              <div className='flex justify-between items-center py-6 w-full'>
                <ArrowLeftCircleIcon className='cursor-pointer' onClick={handlePreviusStep} height={24} width={24} />
                <div className="mt-6">
                  <ButtonOptions onClick={handleNextStep} text={'Siguiente'} />
                </div>
              </div>
              <div className="flex flex-wrap justify-around gap-4 rounded-lg">
                {locationCategories.map(({ category }) => (
                  <div 
                    key={category} 
                    className={`flex-grow p-4 rounded-lg w-[350px] max-h-[500px] cursor-pointer ${selectedCategory === category ? 'bg-primary-blue text-white' : 'bg-gray-200'}`} 
                    onClick={() => setSelectedCategory(category)}
                  >
                    <h2 className="font-semibold text-center text-xl">{category}</h2>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {steps === 2 && selectedCategory && (
          <>
            <div className="flex flex-col">
              <div className='flex justify-between items-center py-6 w-full'>
                <ArrowLeftCircleIcon className='cursor-pointer' onClick={handlePreviusStep} height={24} width={24} />
                <div className="mt-6">
                  <ButtonOptions onClick={handleNextStep} text={'Ver puntos seleccionados'} />
                </div>
              </div>
              <div className="flex flex-wrap justify-around gap-4 rounded-lg">
                {locationCategories.filter(({ category }) => category === selectedCategory).map(({ places }) => (
                  places.map(({ name, coordinates }) => (
                    <li key={name} className="flex justify-between items-center bg-white mb-2 p-2 rounded-md w-[350px]">
                      <span>{name}</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          onChange={() => handleCheckboxChange(name, coordinates)}
                          checked={selectedItems.includes(name)}
                        />
                        <button className="text-blue-500 underline" onClick={() => navigate(`/place-details/${name}`)}>Ver detalle</button>
                      </div>
                    </li>
                  ))
                ))}
              </div>
            </div>
          </>
        )}

        {steps === 3 && (
          <div className='flex items-start mt-40'>
            <div className='flex flex-wrap gap-4'>
              <div className='flex flex-col gap-6'>
                <ArrowLeftCircleIcon className='cursor-pointer' onClick={handlePreviusStep} height={24} width={24} />
                <div className='flex flex-col gap-4 bg-primary-lightBlue p-8 rounded-md'>
                  {selectedItems.map(item => (
                    <div key={item} className='flex justify-between items-center bg-primary-blue px-6 py-2 rounded-md text-black'>
                      <span>{item}</span>
                      <button className='ml-4 text-red-500' onClick={() => handleDeletePoint(item)}>Eliminar</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex flex-col justify-center gap-4'>
                {/* <ButtonOptions onClick={handlePreviusStep} text={'Gestionar puntos turístico'} /> */}
                <ButtonOptions onClick={handleNextStep} text={'Confirmar plan de viaje'} />
              </div>
            </div>
          </div>
        )}

        {steps === 4 && (
          <div className='flex justify-center items-center'>
            <div className='flex flex-wrap justify-center gap-4'>
              <div className='flex flex-col gap-6'>
                <ArrowLeftCircleIcon className='cursor-pointer' onClick={handlePreviusStep} height={24} width={24} />
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
                    allowFullScreen=""
                    loading="lazy"
                    className='border-0 rounded-md w-full md:w-[500px] h-[500px]'
                  ></iframe>
                ) : (
                  <div>Generando mapa...</div>
                )}
                <ButtonOptions onClick={handleConfirmTrip} text={'Guardar plan de viaje'} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default GoCalendar;
