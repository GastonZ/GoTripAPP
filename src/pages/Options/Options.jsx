import React from 'react'
import ButtonOptions from '../../components/ButtonOptions'
import { icons } from '../../assets'
import { Link } from 'react-router-dom'

const Options = () => {

    const buttonArray = [
        {
            text: 'Realizar plan de viaje',
            icon: icons.startIcon,
            href: '/calendario'
        },
        {
            text: 'Puntos turisticos & eventos',
            icon: icons.touristIcon,
            href: '/calendario'
        },
        {
            text: 'Mis viajes',
            icon: icons.tripIcon,
            href: '/misviajes'
        },
        {
            text: 'Puntos de carga',
            icon: icons.chargeIcon,
            href: '/calendario'
        },
        {
            text: 'Consultar a chatbot',
            icon: icons.botIcon,
            href: '/chatbot'
        },
    ]

    return (
        <main className="flex flex-col justify-center items-center bg-background-navy h-screen">
            <img className="relative rounded-lg w-full h-[400px] object-cover" src={icons.cabildo} alt="" />
            <div className="bottom-28 absolute flex flex-wrap justify-center gap-8">
                {buttonArray.map((x, index) => (
                    <Link key={index} to={x.href}>
                        <button className="flex flex-col justify-center items-center bg-primary-blue shadow-lg p-2 rounded-md w-[150px] h-[150px] text-white transform transition duration-300 hover:scale-105">
                            <img src={x.icon} alt={x.text} className="bg-primary-blue mb-4 w-8 h-8" />
                            <span className="font-semibold text-center text-lg">{x.text}</span>
                        </button>
                    </Link>
                ))}
            </div>
        </main>

    )
}

export default Options