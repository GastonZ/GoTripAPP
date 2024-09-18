import React from 'react'
import ButtonOptions from '../../components/ButtonOptions'

const Options = () => {

    const buttonArray = [
        {
            text: 'Realizar plan de viaje',
            icon: ''
        },
        {
            text: 'Puntos turisticos & eventos',
            icon: ''
        },
        {
            text: 'Mis viajes',
            icon: ''
        },
        {
            text: 'Puntos de carga',
            icon: ''
        },
        {
            text: 'Consultar a chatbot',
            icon: ''
        },
    ]

    return (
        <main className='place-content-center grid bg-background-navy h-screen'>
            <div className='flex justify-around gap-4'>
                {buttonArray.map((x, index) => (
                    <ButtonOptions key={index} text={x.text} />
                ))}
            </div>
        </main>
    )
}

export default Options