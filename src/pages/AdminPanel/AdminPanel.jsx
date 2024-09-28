import React, { useState, useEffect } from 'react';
import SideMenuAdmin from '../../components/SideMenuAdmin';
import ModalCustom from '../../components/ModalCustom';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';

const AdminPanel = () => {
  const [selectedItem, setSelectedItem] = useState('userManagement');
  const [users, setUsers] = useState([]);

  const [openModalPoints, setOpenModalPoints] = useState(false);
  const [openModalCategory, setOpenModalCategory] = useState(false);
  const [openModalCaracteristc, setOpenModalCaracteristc] = useState(false);
  const [openModalEvent, setOpenModalEvent] = useState(false);

  const [newCategory, setNewCategory] = useState('');
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCoordinates, setNewPlaceCoordinates] = useState('');

  const [categories, setCategories] = useState([]);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);


  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const storedCategories = JSON.parse(localStorage.getItem('locationCategories')) || [];
    setCategories(storedCategories);
    setUsers(storedUsers);
  }, []);

  const handleAddCategory = () => {
    if (newCategory !== '') {
      const updatedCategories = [...categories, { category: newCategory, places: [] }];
      localStorage.setItem('locationCategories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      setNewCategory('');
      setOpenModalCategory(false);
    } else {
      console.log('Category name cannot be empty');
    }
  };

  const handleDeleteCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    localStorage.setItem('locationCategories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
  };

  const handleEditCategory = (index) => {
    const updatedCategories = [...categories];
    updatedCategories[index].category = editingCategoryName;
    localStorage.setItem('locationCategories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
    setEditingCategoryIndex(null);
    setEditingCategoryName('');
  };

  const deleteUser = (indexToDelete) => {
    const updatedUsers = users.filter((_, index) => index !== indexToDelete);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  /* Tourist spots */

  const handleAddPlace = () => {
    if (newPlaceName !== '' && newPlaceCoordinates !== '') {
      const updatedCategories = [...categories];

      updatedCategories[selectedCategoryIndex].places.push({
        name: newPlaceName,
        coordinates: newPlaceCoordinates,
      });

      setCategories(updatedCategories);
      localStorage.setItem('locationCategories', JSON.stringify(updatedCategories));
      
      setNewPlaceName('');
      setNewPlaceCoordinates('');
      setOpenModalPoints(false);
    } else {
      console.log('Place name and coordinates cannot be empty');
    }
  };

  const handleDeletePlace = (catIndex, placeIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[catIndex].places.splice(placeIndex, 1);
    setCategories(updatedCategories);
    localStorage.setItem('locationCategories', JSON.stringify(updatedCategories));
  };

  const handleEditPlace = (catIndex, placeIndex) => {
    const placeToEdit = categories[catIndex].places[placeIndex];
    const updatedPlaceName = prompt('Edit place name', placeToEdit.name);
    const updatedPlaceCoordinates = prompt('Edit place coordinates', placeToEdit.coordinates);

    if (updatedPlaceName && updatedPlaceCoordinates) {
      const updatedCategories = [...categories];
      updatedCategories[catIndex].places[placeIndex] = {
        name: updatedPlaceName,
        coordinates: updatedPlaceCoordinates,
      };
      setCategories(updatedCategories);
      localStorage.setItem('locationCategories', JSON.stringify(updatedCategories));
    }
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
                    <TrashIcon className='w-6 h-6'/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'touristSpots':
        return (
          <div className='w-full h-screen'>
            <div className='flex justify-between mb-6 w-full'>
              <h1 className='text-3xl'>Gestión de puntos turísticos</h1>
              <button
                onClick={() => setOpenModalPoints(true)}
                className='bg-primary-blue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150'
              >
                Agregar punto turístico
              </button>
            </div>
            <div className='flex flex-col gap-6'>
              {categories.map((category, catIndex) => (
                <div key={catIndex} className='bg-gray-100 p-4 rounded-lg'>
                  <h2 className='font-semibold text-2xl'>{category.category}</h2>
                  <div className='flex flex-col gap-4 mt-4'>
                    {category.places.map((place, placeIndex) => (
                      <div
                        key={placeIndex}
                        className='flex justify-between items-center bg-primary-lightBlue p-4 rounded-lg'
                      >
                        <div className='flex flex-col'>
                          <span className='font-semibold text-lg'>{place.name}</span>
                          <span className='text-gray-600'>{place.coordinates}</span>
                        </div>
                        <div className='flex gap-2'>
                          <button
                            className='bg-yellow-500 px-4 py-2 rounded-md text-white'
                            onClick={() => handleEditPlace(catIndex, placeIndex)}
                          >
                            <PencilIcon className='w-6 h-6'/>
                          </button>
                          <button
                            className='bg-red-500 px-4 py-2 rounded-md text-white'
                            onClick={() => handleDeletePlace(catIndex, placeIndex)}
                          >
                            <TrashIcon className='w-6 h-6'/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <ModalCustom
              introText={'Agregar nuevo punto turistico'}
              radius={10}
              modalState={openModalPoints}
              handleModalClose={() => setOpenModalPoints(false)}
            >
              <div className='flex flex-col gap-3 p-6'>
                <input
                  placeholder='Nombre del lugar'
                  className='p-4 rounded-md outline-none'
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                />
                <input
                  placeholder='Coordenadas del lugar'
                  className='p-4 rounded-md outline-none'
                  value={newPlaceCoordinates}
                  onChange={(e) => setNewPlaceCoordinates(e.target.value)}
                />

                <select
                  value={selectedCategoryIndex}
                  onChange={(e) => setSelectedCategoryIndex(parseInt(e.target.value))}
                  className='p-4 rounded-md outline-none'
                >
                  {categories.map((category, index) => (
                    <option key={index} value={index}>
                      {category.category}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddPlace}
                  className='bg-primary-darkBlue mt-4 p-2 rounded-lg text-white'
                >
                  Agregar
                </button>
              </div>
            </ModalCustom>
          </div>
        );
      case 'categoryManagement':
        return (
          <div className='w-full h-screen'>
            <div className='flex justify-between mb-6 w-full'>
              <h1 className='text-3xl'>Gestión de categorías</h1>
              <button
                onClick={() => setOpenModalCategory(true)}
                className='bg-primary-blue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150'
              >
                Agregar categoría
              </button>
            </div>
            <div className='flex flex-col justify-center gap-4'>
              {categories.map((x, index) => (
                <div key={index} className='flex justify-between items-center bg-primary-blue p-4 rounded-lg w-max'>
                  {editingCategoryIndex === index ? (
                    <>
                      <input
                        className='p-2 rounded-md outline-none'
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                      />
                      <button
                        className='bg-green-500 ml-2 px-4 py-2 rounded-md text-white'
                        onClick={() => handleEditCategory(index)}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span className='text-2xl text-white'>{x.category}</span>
                      <div className='flex pl-4'>
                        <button
                          className='bg-yellow-500 mr-2 px-2 py-1 rounded-md text-white'
                          onClick={() => {
                            setEditingCategoryIndex(index);
                            setEditingCategoryName(x.category);
                          }}
                        >
                          <PencilIcon className='w-6 h-6'/>
                        </button>
                        <button
                          className='bg-red-500 px-2 py-1 rounded-md text-white'
                          onClick={() => handleDeleteCategory(index)}
                        >
                          <TrashIcon className='w-6 h-6'/>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <ModalCustom introText={'Agregar nueva categoría'} radius={10} modalState={openModalCategory} handleModalClose={() => setOpenModalCategory(false)}>
              <div className='flex flex-col gap-3 p-6'>
                <input
                  onChange={(e) => setNewCategory(e.target.value)}
                  value={newCategory}
                  placeholder='Nombre categoría'
                  className='p-4 rounded-md outline-none'
                />
                <button onClick={handleAddCategory} className='bg-primary-darkBlue mt-4 p-2 rounded-lg text-white'>
                  Agregar
                </button>
              </div>
            </ModalCustom>
          </div>
        );
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
              <input placeholder='nombre' className='p-4 rounded-md outline-none' />
              <input placeholder='nombre' className='p-4 rounded-md outline-none' />
              <input placeholder='nombre' className='p-4 rounded-md outline-none' />
              <input placeholder='nombre' className='p-4 rounded-md outline-none' />
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
              <input placeholder='nombre' className='p-4 rounded-md outline-none' />
              <input placeholder='nombre' className='p-4 rounded-md outline-none' />
              <input placeholder='nombre' className='p-4 rounded-md outline-none' />
              <input placeholder='nombre' className='p-4 rounded-md outline-none' />
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
