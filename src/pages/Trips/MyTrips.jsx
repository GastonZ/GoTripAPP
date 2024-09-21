import React from 'react';
import MyTripsCard from '../../components/MyTripsCard';

const MyTrips = () => {

    const savedTrips = localStorage.getItem('savedTrips');
    const myTrips = savedTrips ? JSON.parse(savedTrips) : [];

    console.log(myTrips)

    return (
        <main className='flex flex-wrap justify-center items-center h-screen'>
            {
            myTrips.length === 0 ?
            <div className='text-center'>
                <p className='font-bold text-3xl text-black'>Aún no has creado ningún viaje</p>
            </div>
            :
            myTrips.map((x, index) => (
                <MyTripsCard key={index} travelPoints={x.travelPoints} initDate={x.date[0]} endDate={x.date[1]}/>
            ))}
        </main>
    )
}

export default MyTrips