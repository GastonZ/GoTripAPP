import React from 'react'
import { icons } from '../../assets'
import { Link } from 'react-router-dom'
import { Battery100Icon, ChatBubbleBottomCenterIcon, HeartIcon, MapIcon, PencilIcon } from '@heroicons/react/20/solid'

const Options = () => {

    const currentUserBlind = localStorage.getItem('isNoVidente') || null;

    const buttonArray = [
        {
            text: 'Realizar plan de viaje',
            icon: <PencilIcon className='w-10 h-10' />,
            href: '/calendario'
        },
        {
            text: 'Puntos turisticos & eventos',
            icon: <MapIcon className='w-10 h-10' />,
            href: '/puntos-turisticos'
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
            href: '/puntos-turisticos'
        },
        {
            text: 'Consultar a chatbot',
            icon: <ChatBubbleBottomCenterIcon className='w-10 h-10' />,
            href: '/chatbot'
        },
        {
            text: 'Guia Turistica',
            icon: <ChatBubbleBottomCenterIcon className='w-10 h-10' />,
            href: '/guia-turistica'
        },
    ]

    return (
        currentUserBlind ?
            <main className='flex flex-wrap justify-center items-center gap-10 min-h-screen'>
                <div className="absolute flex flex-wrap justify-center gap-8">
                    {buttonArrayBlind.map((x, index) => (
                        <Link key={index} to={x.href}>
                            <button className="flex flex-col justify-center items-center bg-primary-blue shadow-lg p-2 rounded-md w-[150px] h-[150px] text-white hover:scale-105 transition duration-300 transform">
                                {x.icon}
                                <span className="font-semibold text-lg text-center">{x.text}</span>
                            </button>
                        </Link>
                    ))}
                </div>
            </main>
            :
            <main className="flex flex-col items-center bg-background-navy min-h-screen">
                <img className="relative p-8 rounded-lg w-full h-[300px] lg:h-[700px] object-cover" src={icons.cabildo} alt="" />
                <div className="top-[20%] lg:top-2/3 absolute flex flex-wrap justify-center gap-8">
                    {buttonArray.map((x, index) => (
                        <Link key={index} to={x.href}>
                            <button className="flex flex-col justify-center items-center bg-primary-blue shadow-lg p-2 rounded-md w-[150px] h-[150px] text-white hover:scale-105 transition duration-300 transform">
                                {x.icon}
                                <span className="font-semibold text-lg text-center">{x.text}</span>
                            </button>
                        </Link>
                    ))}
                </div>
            </main>
    )
}

export default Options