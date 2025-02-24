import React, { useEffect, useState } from 'react';
import { getAllPuntosTuristicos, getAllEventos, getActiveCategorias } from '../../service/goTripService';
import ModalCustom from '../../components/ModalCustom';


const PointsAndEvents = () => {
    const [events, setEvents] = useState([]);
    const [puntosTuristicos, setPuntosTuristicos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [selectedPunto, setSelectedPunto] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalTop, setModalTop] = useState(0);

    useEffect(() => {
        fetchPuntosTuristicos();
        fetchEventos();
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (openModal) {
           window.scrollTo({top:0, behavior: "smooth"});
        }
    }, [openModal]);

    const fetchPuntosTuristicos = async () => {
        try {
            const data = await getAllPuntosTuristicos();
            setPuntosTuristicos(data || []);
        } catch (error) {
            console.error("Error obteniendo puntos turísticos:", error);
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

    const fetchCategorias = async () => {
        try {
            const data = await getActiveCategorias();
            setCategorias(data || []);
        } catch (error) {
            console.error("Error obteniendo categorías:", error);
        }
    };

    const handleOpenModal = (punto) => {
        setSelectedPunto(punto);
        setOpenModal(true);
    };

    return (
        <div className='flex flex-col p-6 w-full h-screen'>
            {/* Título Puntos Turísticos */}
            <span className='mb-4 font-semibold text-4xl'>Puntos Turísticos</span>

            {/* Mostrar Puntos Turísticos separados por categoría */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {categorias.map((categoria) => {
                    const puntosDeCategoria = puntosTuristicos.filter(pt => pt.categoriaId === categoria.id);
                    if (puntosDeCategoria.length === 0) return null;
                    return (
                        <div key={categoria.id} className='bg-primary-blue p-6 rounded-lg w-full'>
                            <h2 className='font-semibold text-white text-2xl mb-4'>{categoria.descripcion}</h2>

                            {/* Contenedor de puntos turísticos con tres por fila */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {puntosDeCategoria.map((punto) => (
                                    <div
                                        key={punto.id}
                                        className='bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full'
                                    >
                                        <div>
                                            <h3 className='font-semibold text-lg text-gray-800'>{punto.nombre}</h3>
                                            <p className='text-gray-600 text-sm'>{punto.latitud} {punto.longitud}</p>
                                        </div>
                                        <button
                                            onClick={() => handleOpenModal(punto)}
                                            className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 self-end'
                                        >
                                            Ver Detalle
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Título Eventos */}
            <span className='mt-6 font-semibold text-4xl'>Eventos</span>

            {/* Mostrar Eventos */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {categorias
                    .map((categoria) => {
                        const eventosDeCategoria = events.filter(evento => evento.categoriaId === categoria.id);
                        return { ...categoria, eventos: eventosDeCategoria };
                    })
                    .filter(categoria => categoria.eventos.length > 0) // Filtramos solo las categorías que tienen eventos
                    .sort((a, b) => b.eventos.length - a.eventos.length) // Ordenamos de mayor a menor cantidad de eventos
                    .map((categoria) => (
                        <div key={categoria.id} className='bg-primary-blue p-6 rounded-lg w-full'>
                            <h2 className='font-semibold text-white text-2xl mb-4'>{categoria.descripcion}</h2>

                            {/* Contenedor de eventos con hasta tres por fila */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {categoria.eventos.map((evento) => (
                                    <div
                                        key={evento.id}
                                        className='bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full'
                                    >
                                        <div>
                                            <h3 className='font-semibold text-lg text-gray-800'>{evento.nombre}</h3>
                                            <p className='text-gray-600 text-sm'>{evento.latitud} {evento.longitud}</p>
                                            <p className='text-gray-600 text-sm mt-2'>
                                                Del {new Date(evento.fechaInicio).toLocaleDateString()} al {new Date(evento.fechaFin).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleOpenModal(evento)}
                                            className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 self-end'
                                        >
                                            Ver Detalle
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>

            {openModal && (
                <ModalCustom radius={10}
                    introText={selectedPunto.fechaInicio ? "Detalles del Evento" : "Detalles del Punto Turístico"}
                    modalState={openModal}
                    handleModalClose={() => setOpenModal(false)}
                    style={{ position: "absolute", top: modalTop, left: "50%", transform: "translateX(-50%)" }}>
                    <div className="p-4">
                        <h2 className="font-semibold text-xl">{selectedPunto.nombre}</h2>
                        <p><strong>Descripción:</strong> {selectedPunto.descripcion}</p>
                        <p><strong>Ubicación:</strong> {selectedPunto.latitud}, {selectedPunto.longitud}</p>
                        {selectedPunto.fechaInicio ? (
                            <p><strong>Fechas: </strong>Del {new Date(selectedPunto.fechaInicio).toLocaleDateString()} al {new Date(selectedPunto.fechaFin).toLocaleDateString()}</p>
                        ) : null}
                        {selectedPunto.pathImagen ? (
                            <img
                                src={`https://localhost:7070/${selectedPunto.pathImagen}`}
                                alt=""
                                className='m-auto pt-4 w-[200px] h-[200px] object-cover'
                            />
                        ) : null}
                    </div>
                </ModalCustom>
            )}
        </div>
    );
};

export default PointsAndEvents;
