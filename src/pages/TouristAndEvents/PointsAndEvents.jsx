import React, { useEffect, useState } from 'react';
import { getAllPuntosTuristicos, getAllEventos, getActiveCategorias } from '../../service/goTripService';
import ModalCustom from '../../components/ModalCustom';

const PointsAndEvents = () => {
    const [events, setEvents] = useState([]);
    const [puntosTuristicos, setPuntosTuristicos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchPuntosTuristicos();
        fetchEventos();
        fetchCategorias();
    }, []);

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

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setOpenModal(true);
    };

    return (
        <div className='flex flex-col p-6 w-full h-screen'>
            {/* 🔹 Puntos Turísticos */}
            <span className='mb-4 font-semibold text-4xl'>Puntos Turísticos</span>

            <div className='flex flex-wrap gap-4'>
                {categorias.length === 0 ? (
                    <p className="text-gray-500">No hay categorías disponibles</p>
                ) : (
                    categorias.map((categoria) => {
                        const puntosDeCategoria = puntosTuristicos.filter(pt => pt.categoriaId === categoria.id);

                        return (
                            <div key={categoria.id} className='bg-primary-blue p-6 rounded-lg w-full md:w-auto'>
                                <h2 className='font-semibold text-white text-2xl'>{categoria.descripcion}</h2>
                                {puntosDeCategoria.length === 0 ? (
                                    <p className="mt-2 text-white text-sm">No hay puntos turísticos en esta categoría</p>
                                ) : (
                                    <ul className='flex flex-col gap-2 mt-2'>
                                        {puntosDeCategoria.map((punto) => (
                                            <li key={punto.id} className='flex justify-between items-center text-white text-base'>
                                                {punto.nombre}
                                                <button
                                                    className="bg-white ml-4 px-3 py-1 rounded-md text-primary-blue text-sm"
                                                    onClick={() => handleOpenModal(punto)}
                                                >
                                                    Ver detalle
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* 🔹 Eventos */}
            <span className='mt-6 font-semibold text-4xl'>Eventos</span>

            <div className='flex flex-wrap gap-6 mt-4'>
                {events.length === 0 ? (
                    <p className="text-gray-500">No hay eventos disponibles</p>
                ) : (
                    events.map((evento) => (
                        <div key={evento.id} className='bg-primary-blue p-6 rounded-lg'>
                            <h2 className='font-semibold text-white text-3xl'>{evento.nombre}</h2>
                            <div className='flex flex-col gap-3 mt-3 text-white text-xl'>
                                <p>{evento.descripcion}</p>
                                <p>
                                    Del {new Date(evento.fechaInicio).toLocaleDateString()} 
                                    al {new Date(evento.fechaFin).toLocaleDateString()}
                                </p>
                                <button
                                    className="bg-white px-3 py-1 rounded-md text-primary-blue text-sm"
                                    onClick={() => handleOpenModal(evento)}
                                >
                                    Ver detalle
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 🔹 Modal de detalles */}
            {openModal && selectedItem && (
                <ModalCustom
                    radius={10}
                    introText="Detalles"
                    modalState={openModal}
                    handleModalClose={() => setOpenModal(false)}
                >
                    <div className="p-4 text-center">
                        <h2 className="font-semibold text-xl">{selectedItem.nombre}</h2>
                        <p><strong>Descripción:</strong> {selectedItem.descripcion}</p>
                        {selectedItem.latitud && selectedItem.longitud && (
                            <p><strong>Ubicación:</strong> {selectedItem.latitud}, {selectedItem.longitud}</p>
                        )}
                        {selectedItem.pathImagen && (
                            <img
                                src={`https://localhost:7070/${selectedItem.pathImagen}`}
                                alt={selectedItem.nombre}
                                className='m-auto pt-4 w-[200px] h-[200px] object-cover'
                            />
                        )}
                    </div>
                </ModalCustom>
            )}
        </div>
    );
};

export default PointsAndEvents;
