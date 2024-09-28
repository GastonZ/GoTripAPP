import React from 'react'
import { icons } from '../../assets'
import { Link } from 'react-router-dom'
import { Battery100Icon, ChatBubbleBottomCenterIcon, HeartIcon, MapIcon, PencilIcon } from '@heroicons/react/20/solid'

const Options = () => {

    const currentUserBlind = JSON.parse(localStorage.getItem('userData')) || ''

    const buttonArray = [
        {
            text: 'Realizar plan de viaje',
            icon: <PencilIcon className='w-10 h-10' />,
            href: '/calendario'
        },
        {
            text: 'Puntos turisticos & eventos',
            icon: <MapIcon className='w-10 h-10' />,
            href: '/calendario'
        },
        {
            text: 'Mis viajes',
            icon: <HeartIcon className='w-10 h-10' />,
            href: '/misviajes'
        },
        {
            text: 'Puntos de carga',
            icon: <Battery100Icon className='w-10 h-10' />,
            href: '/puntos-de-carga'
        },
        {
            text: 'Consultar a chatbot',
            icon: <ChatBubbleBottomCenterIcon className='w-10 h-10' />,
            href: '/chatbot'
        },
    ]

    const buttonArrayBlind = [
        {
            text: 'Realizar plan de viaje',
            icon: <PencilIcon className='w-10 h-10' />,
            href: '/calendario'
        },
        {
            text: 'Puntos turisticos & eventos',
            icon: <MapIcon className='w-10 h-10' />,
            href: '/calendario'
        },
        {
            text: 'Consultar a chatbot',
            icon: <ChatBubbleBottomCenterIcon className='w-10 h-10' />,
            href: '/chatbot'
        },
    ]

    return (
        currentUserBlind.blind ?
            <main className='flex flex-wrap justify-center items-center gap-10 h-screen'>
                <div className="absolute flex flex-wrap justify-center gap-8">
                    {buttonArrayBlind.map((x, index) => (
                        <Link key={index} to={x.href}>
                            <button className="flex flex-col justify-center items-center bg-primary-blue shadow-lg p-2 rounded-md w-[150px] h-[150px] text-white transform transition duration-300 hover:scale-105">
                                {x.icon}
                                <span className="font-semibold text-center text-lg">{x.text}</span>
                            </button>
                        </Link>
                    ))}
                </div>
            </main>
            :
            <main className="flex flex-col items-center bg-background-navy h-screen">
                <img className="relative p-8 rounded-lg w-full h-[700px] object-cover" src={icons.cabildo} alt="" />
                <div className="top-2/3 absolute flex flex-wrap justify-center gap-8">
                    {buttonArray.map((x, index) => (
                        <Link key={index} to={x.href}>
                            <button className="flex flex-col justify-center items-center bg-primary-blue shadow-lg p-2 rounded-md w-[150px] h-[150px] text-white transform transition duration-300 hover:scale-105">
                                {x.icon}
                                <span className="font-semibold text-center text-lg">{x.text}</span>
                            </button>
                        </Link>
                    ))}
                </div>
            </main>

    )
}

export default Options