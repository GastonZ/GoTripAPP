import React from 'react'

const SideMenuAdmin = () => {

    const adminItems = [
        {
            text: "Gestión de usuarios",
            mode: "Gestión de usuarios",
        },
        {
            text: "Gestión de puntos turísticos",
            mode: "Gestión de puntos turísticos",
        },
        {
            text: "Gestión de categoría",
            mode: "Gestión de categoría",
        },
        {
            text: "Gestión de carasterística",
            mode: "Gestión de carasterística",
        },
        {
            text: "Gestión de evento",
            mode: "Gestión de evento",
        },
        {
            text: "Ver modo turista",
            mode: "Ver modo turista",
        },
    ]

    return (
        <div className='flex flex-col items-center bg-gray-300 py-4 w-[400px] h-screen'>
            <h1 className='bg-black p-2 rounded-lg w-[150px] font-medium text-center text-white text-xl'>Administrador</h1>
            <div className='flex flex-col gap-3 my-8'>
                {adminItems.map((x) => (
                    <button className='bg-primary-blue p-2 rounded-xl font-semibold text-white'>
                        {x.text}
                    </button>
                ))}
            </div>
            <h1 className='bg-black p-2 rounded-lg w-[150px] font-medium text-center text-white text-xl'>Cerrar sesión</h1>
        </div>
    )
}

export default SideMenuAdmin