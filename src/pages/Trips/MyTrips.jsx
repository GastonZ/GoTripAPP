import React, { useState } from 'react';
import MyTripsCard from '../../components/MyTripsCard';

const MyTrips = () => {
  const savedTrips = localStorage.getItem('savedTrips');
  const myTrips = savedTrips ? JSON.parse(savedTrips) : [];

  const [selectedTripIndex, setSelectedTripIndex] = useState(null);

  const generateIframeUrl = (coords) => {
    const baseUrl = 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyAvBg2_LvfISOBrPQI5gIVNkF_65ypu-8k';
    const origin = 'current+location';

    const waypoints = coords.slice(0, -1).join('|');
    const finalDestination = coords[coords.length - 1];

    return `${baseUrl}&origin=${origin}&destination=${finalDestination}&waypoints=${waypoints}&mode=driving`;
  };

  return (
    <main className='flex flex-wrap justify-center items-center h-screen'>
      {myTrips.length === 0 ? (
        <div className='text-center'>
          <p className='font-bold text-3xl text-black'>Aún no has creado ningún viaje</p>
        </div>
      ) : (
        myTrips.map((trip, index) => (
          <div key={index} className='flex flex-col mb-6'>
            <MyTripsCard travelPoints={trip.travelPoints} initDate={trip.date[0]} endDate={trip.date[1]} />
            <button
              onClick={() => setSelectedTripIndex(index)}
              className='bg-primary-darkBlue mt-4 p-2 rounded-lg w-max text-white'
            >
              Ver en mapa
            </button>

            {selectedTripIndex === index && (
              <iframe
                src={generateIframeUrl(trip.coords)}
                className='w-full h-[500px]'
                style={{ border: 0, marginTop: '20px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            )}
          </div>
        ))
      )}
    </main>
  );
};

export default MyTrips;
