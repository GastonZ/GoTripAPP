import React, { useEffect, useState } from 'react';
import { getAllPuntosTuristicos, getAllEventos, getActiveCategorias } from '../../service/goTripService';

const PointsAndEvents = () => {
    const [events, setEvents] = useState([]);
    const [puntosTuristicos, setPuntosTuristicos] = useState([]);
    const [categorias, setCategorias] = useState([]);

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

    return (
        <div className='flex flex-col p-6 w-full h-screen'>
            {/* Título Puntos Turísticos */}
            <span className='mb-4 font-semibold text-4xl'>Puntos Turísticos</span>

            {/* Mostrar Puntos Turísticos separados por categoría */}
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
                                    <ul className='mt-2'>
                                        {puntosDeCategoria.map((punto) => (
                                            <li key={punto.id} className='text-white text-base'>{punto.nombre}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Título Eventos */}
            <span className='mt-6 font-semibold text-4xl'>Eventos</span>

            {/* Mostrar Eventos */}
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
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PointsAndEvents;
