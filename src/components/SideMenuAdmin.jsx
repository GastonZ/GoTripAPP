import React from 'react';

const SideMenuAdmin = ({ selectedItem, setSelectedItem }) => {
    const adminItems = [
        { text: "Gestión de usuarios", mode: "userManagement" },
        { text: "Gestión de puntos turísticos", mode: "touristSpots" },
        { text: "Gestión de categoría", mode: "categoryManagement" },
/*         { text: "Gestión de carasterística", mode: "featureManagement" }, */
        { text: "Gestión de evento", mode: "eventManagement" },
/*         { text: "Ver modo turista", mode: "touristMode" } */
    ];

    return (
        <div className='flex flex-col items-center bg-primary-blue py-4 w-full md:w-[400px] md:h-screen'>
            <h1 className='p-2 border-b border-b-slate-900 w-full font-medium text-3xl text-black text-left'>Administrador</h1>
            <div className='flex flex-col gap-3 my-8 pl-4 w-full'>
                {adminItems.map((item) => (
                    <button
                        key={item.mode}
                        className={`${selectedItem === item.mode ? 'bg-white text-black' : 'text-white'} p-4 font-semibold text-left`}
                        onClick={() => setSelectedItem(item.mode)}
                    >
                        {item.text}
                    </button>
                ))}
            </div>
            <h1 className='bg-black p-2 rounded-lg w-[150px] font-medium text-center text-white text-xl'>Cerrar sesión</h1>
        </div>
    );
};

export default SideMenuAdmin;
