import React, { useEffect, useState } from 'react'

const PointsAndEvents = () => {

    const [events, setEvents] = useState([])
    const [locations, setLocations] = useState([])

    useEffect(() => {
        const storedCategories = JSON.parse(localStorage.getItem('locationCategories')) || [];
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        setEvents(storedEvents);
        setLocations(storedCategories);
    }, []);

    return (
        <div className='flex flex-col w-full h-screen'>
            <span className='p-6 font-semibold text-4xl'>Puntos Turisticos</span>
            <div className='flex flex-wrap gap-4 p-6'>
                {
                    locations.map((categories, index) => (
                        <div key={index} className='flex flex-col flex-wrap gap-4 bg-primary-blue p-6 rounded-lg w-full md:w-auto'>
                            <h2 className='font-semibold text-2xl'>
                                {categories.category}
                            </h2>
                            <div>
                                {
                                    categories.places.map((x, index) => (
                                        <p key={index} className='text-base text-white'>
                                            {x.name}
                                        </p>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            <span className='flex gap-4 p-6 font-semibold text-4xl'>Eventos</span>
            <div className='flex flex-wrap gap-6 p-6'>
                {
                    events.map((x, index) => (
                        <div key={index} className='flex flex-col flex-wrap gap-4 bg-primary-blue p-6 rounded-lg'>
                            <h2 className='font-semibold text-3xl'>
                                {x.name}
                            </h2>
                            <div className='flex flex-col gap-3 mt-3'>
                                <p className='text-white text-xl'>
                                {x.description}
                                </p>
                                <p className='text-white text-xl'>
                                   Del {new Date(x.initDate).toLocaleString()} al {new Date(x.endDate).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default PointsAndEvents