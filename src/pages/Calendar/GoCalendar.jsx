import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ButtonOptions from '../../components/ButtonOptions';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import { getActiveCategorias, getAllPuntosTuristicos, getAllEventos } from '../../service/goTripService';
import ModalCustom from '../../components/ModalCustom';
import { TrashIcon } from 'lucide-react';

const GoCalendar = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState([new Date(), new Date()]);
  const [steps, setSteps] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsCoords, setSelectedItemsCoords] = useState([]);
  const [iframeUrl, setIframeUrl] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [puntosTuristicos, setPuntosTuristicos] = useState([]);
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);


  useEffect(() => {
    fetchCategorias();
    fetchEventos();
  }, []);

  const fetchCategorias = async () => {
    try {
      const data = await getActiveCategorias();
      setCategorias(data || []);
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
    }
  };

  const fetchEventos = async () => {
    try {
      const data = await getAllEventos();
      setEvents(data || []);
    } catch (error) {
      console.error("Error obteniendo eventos:", error);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchPuntosTuristicos();
    }
  }, [selectedCategory]);

  const fetchPuntosTuristicos = async () => {
    try {
      const data = await getAllPuntosTuristicos();
      const filtrados = data.filter(pt => pt.categoriaId === selectedCategory);
      setPuntosTuristicos(filtrados);
    } catch (error) {
      console.error("Error obteniendo puntos turísticos:", error);
    }
  };


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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleCalendarChange = (dates) => {
    const [start, end] = dates;
    if (start >= today && end >= start) {
      setValue([start, end]);
    } else {
      alert('Selecciona un rango de fechas válido');
    }
  };

  const handleCheckboxChange = (item, type) => {
    const key = `${type}_${item.id}`;
    setSelectedItems((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );

    if (type === "punto") {
      const coordString = `${item.latitud},${item.longitud}`;
      setSelectedItemsCoords((prevCoords) =>
        prevCoords.includes(coordString)
          ? prevCoords.filter(coord => coord !== coordString)
          : [...prevCoords, coordString]
      );
    }
  };

  const handleDeletePoint = (id, type) => {
    const key = `${type}_${id}`;

    setSelectedItems((prev) => prev.filter(item => item !== key));

    if (type === "punto") {
      setSelectedItemsCoords((prevCoords) =>
        prevCoords.filter(coord => !coord.includes(id))
      );
    }
  };

  const handleConfirmTrip = async () => {
    if (!value || selectedItems.length === 0) {
      alert("Debes seleccionar al menos un punto turístico o un evento.");
      return;
    }

    const nuevoPlanViaje = {
      usuarioId: 1,
      fechaInicio: value[0].toISOString(),
      fechaFin: value[1].toISOString(),
      descripcion: "Nuevo plan de viaje",
      lineaPlanViaje: selectedItems.map((key) => {
        const [type, id] = key.split("_");
        return type === "punto"
          ? { puntoTuristicoId: parseInt(id) }
          : { eventoId: parseInt(id) };
      })
    };

    try {
      await createPlanViaje(nuevoPlanViaje);
      alert("Plan de viaje creado con éxito.");
      navigate("/opciones");
    } catch (error) {
      console.error("Error creando plan de viaje:", error);
      alert("Error al crear el plan de viaje.");
    }
  };

  const generateIframeUrl = async () => {
    if (selectedItems.length < 1) return;
  
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = `${position.coords.latitude},${position.coords.longitude}`;
          const baseUrl = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyAvBg2_LvfISOBrPQI5gIVNkF_65ypu-8k";
          
          const selectedCoordinates = selectedItems.map((key) => {
            const [type, id] = key.split("_");
            if (type === "punto") {
              const punto = puntosTuristicos.find((pt) => pt.id === parseInt(id));
              return punto ? `${punto.latitud},${punto.longitud}` : null;
            } else if (type === "evento") {
              const evento = events.find((ev) => ev.id === parseInt(id));
              return evento ? `${evento.latitud},${evento.longitud}` : null;
            }
            return null;
          }).filter(Boolean);
  
          if (selectedCoordinates.length < 1) {
            reject("No hay coordenadas suficientes para generar el mapa.");
            return;
          }
  
          const waypoints = selectedCoordinates.slice(0, -1).join("|");
          const finalDestination = selectedCoordinates[selectedCoordinates.length - 1];
  
          const url = `${baseUrl}&origin=${userCoords}&destination=${finalDestination}&waypoints=${waypoints}&mode=driving`;
          resolve(url);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          reject("No se pudo obtener la ubicación del usuario.");
        }
      );
    });
  };
  
  useEffect(() => {
    if (steps === 3 && selectedItems.length > 0) {
      generateIframeUrl()
        .then((url) => setIframeUrl(url))
        .catch((err) => console.error(err));
    }
  }, [steps, selectedItems]);

  const handleOpenModal = (punto) => {
    setSelectedPunto(punto);
    setOpenModal(true);
  };

  console.log(selectedItems);


  return (
    <main>
      <div className='flex md:flex-row flex-col justify-center bg-gray-400 pt-4'>
        {["Seleccionar fechas", "Puntos turísticos", "Destinos seleccionados", "Recorrido generado"].map((text, index) => (
          <div key={index} className={`${steps === index ? 'bg-background-navy' : ''} p-6 text-3xl rounded-t-lg relative`}>
            <div className={`${steps !== index ? 'hidden' : 'block'} top-1 left-1 absolute bg-primary-blue rounded-full w-6 h-6 text-center text-sm`}>{index + 1}</div>
            <p className='text-center'>{text}</p>
          </div>
        ))}
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
                    {value[0].getDate()}/{value[0].getMonth() + 1}/{value[0].getFullYear()}
                  </span>
                  <p>Fecha de finalización</p>
                  <span className='bg-primary-lightBlue p-2 rounded-sm text-3xl'>
                    {value[1].getDate()}/{value[1].getMonth() + 1}/{value[1].getFullYear()}
                  </span>
                </div>
                <ButtonOptions onClick={handleNextStep} text={'Siguiente'} />
              </div>
              <div className='flex justify-center bg-primary-blue p-6 border-none rounded-xl h-[500px]'>
                <Calendar
                  className='bg-primary-lightBlue border-none rounded-xl w-full transition-all'
                  onChange={handleCalendarChange}
                  value={value}
                  selectRange={true}
                  minDate={today}
                />
              </div>
            </div>
          </div>
        )}
        {steps === 1 && (
          <div className="mt-6">
            <p>Selecciona una categoría</p>
            <div className="flex flex-wrap justify-center gap-4">
              {categorias.map((category) => (
                <div
                  key={category.id}
                  className={`border p-4 rounded-lg w-full md:w-auto cursor-pointer ${selectedCategory === category.id ? 'bg-primary-blue text-white' : 'bg-gray-200'}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <h2 className="font-semibold text-xl text-center">{category.descripcion}</h2>
                </div>
              ))}
            </div>
            {selectedCategory && (
              <>
                {/* Puntos turísticos */}
                <div className="flex flex-col items-center mt-6 mb-4">
                  <p>Puntos turísticos en esta categoría:</p>
                  <div className="flex flex-wrap justify-around gap-4">
                    {puntosTuristicos.map((punto) => (
                      <div key={punto.id} className="flex justify-between items-center bg-white p-4 rounded-md w-[350px]">
                        <span>{punto.nombre}</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            onChange={() => handleCheckboxChange(punto, "punto")}
                            checked={selectedItems.includes(`punto_${punto.id}`)}
                          />
                          <button className="text-blue-500 underline" onClick={() => handleOpenModal(punto)}>Ver detalle</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {console.log(events)
                }
                {/* Eventos */}
                <div className="flex flex-col items-center mt-6 mb-4">
                  <p>Eventos en esta categoría:</p>
                  <div className="flex flex-wrap justify-around gap-4">
                    {events.filter(evento => evento.categoriaId === selectedCategory).map((evento) => (
                      <div key={evento.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-md w-[350px]">
                        <span>{evento.nombre}</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            onChange={() => handleCheckboxChange(evento, "evento")}
                            checked={selectedItems.includes(`evento_${evento.id}`)}
                          />
                          <button className="text-blue-500 underline" onClick={() => handleOpenModal(evento)}>Ver detalle</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className='mt-6'>
              <ButtonOptions onClick={handleNextStep} text={'Siguiente'} />
            </div>
          </div>
        )}

        {openModal && (
          <ModalCustom radius={10} introText="Detalles del Punto Turístico" modalState={openModal} handleModalClose={() => setOpenModal(false)}>
            <div className="p-4">
              <h2 className="font-semibold text-xl">{selectedPunto.nombre}</h2>
              <p><strong>Descripción:</strong> {selectedPunto.descripcion}</p>
              <p><strong>Ubicación:</strong> {selectedPunto.latitud}, {selectedPunto.longitud}</p>
              <img src={selectedPunto.pathImagen} alt="" className='w-10 h-10' />
            </div>
          </ModalCustom>
        )}

        {steps === 2 && (
          <div className='flex flex-col items-center mt-10 w-full'>
            <ArrowLeftCircleIcon className='mb-4 cursor-pointer' onClick={handlePreviusStep} height={24} width={24} />

            <h2 className="mb-4 text-3xl">Puntos y eventos seleccionados</h2>

            {selectedItems.length === 0 ? (
              <p className="text-red-500">No has seleccionado ningún punto turístico ni evento.</p>
            ) : (
              <div className='flex flex-col gap-4 bg-primary-lightBlue p-8 rounded-md w-full max-w-xl'>
                {/* 🔹 Puntos turísticos seleccionados */}
                {selectedItems.filter(key => key.startsWith("punto_")).map((key) => {
                  const puntoId = parseInt(key.split("_")[1]);
                  const punto = puntosTuristicos.find(pt => pt.id === puntoId);

                  return (
                    punto && (
                      <div key={punto.id} className='flex justify-between items-center bg-primary-blue px-6 py-2 rounded-md text-white'>
                        <span className='font-semibold text-xl'>{punto.nombre}</span>
                        <div className="flex items-center space-x-2">
                          <button className='underline' onClick={() => handleOpenModal(punto)}>Ver detalle</button>
                          <TrashIcon className='w-6 h-6 cursor-pointer' onClick={() => handleDeletePoint(punto.id, "punto")} />
                        </div>
                      </div>
                    )
                  );
                })}

                {/* 🔹 Eventos seleccionados */}
                {selectedItems.filter(key => key.startsWith("evento_")).map((key) => {
                  const eventoId = parseInt(key.split("_")[1]);
                  const evento = events.find(ev => ev.id === eventoId);

                  return (
                    evento && (
                      <div key={evento.id} className='flex justify-between items-center bg-gray-500 px-6 py-2 rounded-md text-white'>
                        <span className='font-semibold text-xl'>{evento.nombre}</span>
                        <div className="flex items-center space-x-2">
                          <button className='underline' onClick={() => handleOpenModal(evento)}>Ver detalle</button>
                          <TrashIcon className='w-6 h-6 cursor-pointer' onClick={() => handleDeletePoint(evento.id, "evento")} />
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            )}

            {selectedItems.length > 0 && (
              <div className='mt-5'>
                <ButtonOptions onClick={handleNextStep} text={'Confirmar plan de viaje'} />
              </div>
            )}
          </div>
        )}


        {/* Step 3: Mostrar mapa con los puntos seleccionados */}
        {steps === 3 && (
          <div className='flex flex-col items-center mt-10 w-full'>
            <ArrowLeftCircleIcon className='mb-4 cursor-pointer' onClick={handlePreviusStep} height={24} width={24} />
            <h2 className="mb-4 text-3xl">Mapa del recorrido</h2>

            {iframeUrl ? (
              <iframe
                src={iframeUrl}
                allowFullScreen=""
                loading="lazy"
                className='border-0 rounded-md w-full md:w-[500px] h-[500px]'
              ></iframe>
            ) : (
              <p className="text-gray-500">Generando mapa... Asegúrate de haber seleccionado al menos dos ubicaciones.</p>
            )}

            <ButtonOptions onClick={handleConfirmTrip} text={'Guardar plan de viaje'} />
          </div>
        )}

      </div>
    </main>
  );
}

export default GoCalendar;
