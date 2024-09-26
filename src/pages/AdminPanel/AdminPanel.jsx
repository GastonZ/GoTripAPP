import React, { useState, useEffect } from 'react';
import SideMenuAdmin from '../../components/SideMenuAdmin';
import ModalCustom from '../../components/ModalCustom';

const AdminPanel = () => {
  const [selectedItem, setSelectedItem] = useState('userManagement');
  const [users, setUsers] = useState([]);

  const [openModalPoints, setOpenModalPoints] = useState(false);
  const [openModalCategory, setOpenModalCategory] = useState(false);
  const [openModalCaracteristc, setOpenModalCaracteristc] = useState(false);
  const [openModalEvent, setOpenModalEvent] = useState(false);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  const deleteUser = (indexToDelete) => {
    const updatedUsers = users.filter((_, index) => index !== indexToDelete);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'userManagement':
        return (
          <div className='w-full h-screen'>
            <h1 className='mb-10 text-3xl'>Gestión de usuarios</h1>
            <div className='flex flex-col gap-4'>
              {users.map((user, index) => (
                <div
                  id='user_container'
                  key={index}
                  className='flex justify-between items-center gap-4 bg-primary-lightBlue p-4 rounded-xl w-max'
                >
                  <div className='flex gap-4'>
                    <p className='font-semibold text-xl'>{user.name}</p>
                    <p className='font-semibold text-xl'>{user.surname}</p>
                  </div>
                  <button
                    className='bg-red-500 px-4 py-2 rounded-md text-white'
                    onClick={() => deleteUser(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'touristSpots':
        return <div className='w-full h-screen'>
          <div className='flex justify-between w-full'>
            <h1 className='text-3xl'>
              Gestion de puntos turisticos
            </h1>
            <button onClick={() => setOpenModalPoints(true)} className='bg-primary-blue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150'>Agregar punto turistico</button>
          </div>
          <div className='flex justify-center'>

          </div>
          <ModalCustom radius={10} modalState={openModalPoints} handleModalClose={() => setOpenModalPoints(false)}>
            <div className='flex flex-col gap-3 p-6'>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
            </div>
          </ModalCustom>
        </div>
      case 'categoryManagement':
        return <div className='w-full h-screen'>
          <div className='flex justify-between w-full'>
            <h1 className='text-3xl'>
              Gestion de categorias
            </h1>
            <button onClick={() => setOpenModalCategory(true)} className='bg-primary-blue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150'>Agregar categoria</button>
          </div>
          <div className='flex justify-center'>

          </div>
          <ModalCustom radius={10} modalState={openModalCategory} handleModalClose={() => setOpenModalCategory(false)}>
            <div className='flex flex-col gap-3 p-6'>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
            </div>
          </ModalCustom>
        </div>
      case 'featureManagement':
        return <div className='w-full h-screen'>
          <div className='flex justify-between w-full'>
            <h1 className='text-3xl'>
              Gestion de caracteristicas
            </h1>
            <button onClick={() => setOpenModalCaracteristc(true)} className='bg-primary-blue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150'>Agregar caracteristica</button>
          </div>
          <div className='flex justify-center'>

          </div>
          <ModalCustom radius={10} modalState={openModalCaracteristc} handleModalClose={() => setOpenModalCaracteristc(false)}>
            <div className='flex flex-col gap-3 p-6'>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
            </div>
          </ModalCustom>
        </div>
      case 'eventManagement':
        return <div className='w-full h-screen'>
          <div className='flex justify-between w-full'>
            <h1 className='text-3xl'>
              Gestion de eventos
            </h1>
            <button onClick={() => setOpenModalEvent(true)} className='bg-primary-blue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150'>Agregar evento</button>
          </div>
          <div className='flex justify-center'>

          </div>
          <ModalCustom radius={10} modalState={openModalEvent} handleModalClose={() => setOpenModalEvent(false)}>
            <div className='flex flex-col gap-3 p-6'>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
              <input placeholder='nombre' className='p-4 rounded-md outline-none'/>
            </div>
          </ModalCustom>
        </div>
      case 'touristMode':
        return <div className='w-full h-screen'>
          <h1 className='text-3xl'>
            Modo turista
          </h1>
          <div className='flex justify-center'>

          </div>
        </div>
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <main className='flex md:flex-row flex-col'>
      <SideMenuAdmin selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <div className='flex-grow p-8'>
        {renderContent()}
      </div>
    </main>
  );
};

export default AdminPanel;
