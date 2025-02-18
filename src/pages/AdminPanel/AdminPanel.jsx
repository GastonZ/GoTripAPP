import React, { useState, useEffect } from 'react';
import SideMenuAdmin from '../../components/SideMenuAdmin';
import ModalCustom from '../../components/ModalCustom';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { getAllUsuarios, inactivateUsuario, getAllPuntosTuristicos, createPuntoTuristico, updatePuntoTuristico, inactivatePuntoTuristico, getActiveCategorias, createCategoria, updateCategoria, inactivateCategoria } from '../../service/goTripService';

const AdminPanel = () => {
  const [selectedItem, setSelectedItem] = useState('userManagement');

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await getAllUsuarios();
      if (data) setUsers(data);
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro que desea inhabilitar este usuario?");
    if (confirmDelete) {
      try {
        await inactivateUsuario(id);
        fetchUsuarios(); // Recargar la lista después de borrar
      } catch (error) {
        console.error("Error eliminando usuario:", error);
      }
    }
  };

  const [puntosTuristicos, setPuntosTuristicos] = useState([]);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceCoordinates, setNewPlaceCoordinates] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedUbicacionId, setSelectedUbicacionId] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [categories, setCategories] = useState([]); // Cargar desde API

  useEffect(() => {
    fetchPuntosTuristicos();
    fetchCategorias();
  }, []);

  const fetchPuntosTuristicos = async () => {
    try {
      const data = await getAllPuntosTuristicos();
      if (data) setPuntosTuristicos(data);
    } catch (error) {
      console.error("Error obteniendo puntos turísticos:", error);
    }
  };

  const handleAddPuntoTuristico = async () => {
    if (!newPlaceName || !selectedCategoryId || !selectedUbicacionId) {
      alert("Por favor, completa todos los campos obligatorios");
      return;
    }
  
    const nuevoPunto = {
      descripcion: newPlaceName,
      categoriaId: parseInt(selectedCategoryId),
      ubicacionId: parseInt(selectedUbicacionId),
      pathImagen: imagePath || "", 
      comentarios: comentarios ? comentarios.split(",").map(c => c.trim()) : []
    };
  
    console.log("Enviando punto turístico:", nuevoPunto);
  
    try {
      const response = await createPuntoTuristico(nuevoPunto);
      console.log("Respuesta API:", response);
  
      fetchPuntosTuristicos();
      setOpenModalPoints(false);
      setNewPlaceName("");
      setSelectedCategoryId("");
      setSelectedUbicacionId("");
      setImagePath("");
      setComentarios("");
    } catch (error) {
      console.error("Error creando punto turístico:", error);
    }
  };
  

  const handleEditPuntoTuristico = async (punto) => {
    const nuevaDescripcion = prompt("Editar nombre del punto turístico:", punto.descripcion);
    if (!nuevaDescripcion) return;

    try {
      await updatePuntoTuristico(punto.id, { ...punto, descripcion: nuevaDescripcion });
      fetchPuntosTuristicos();
    } catch (error) {
      console.error("Error editando punto turístico:", error);
    }
  };

  const handleDeletePuntoTuristico = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este punto turístico?")) {
      try {
        await inactivatePuntoTuristico(id);
        fetchPuntosTuristicos();
      } catch (error) {
        console.error("Error eliminando punto turístico:", error);
      }
    }
  };

  const [categorias, setCategorias] = useState([]);

useEffect(() => {
  fetchCategorias();
}, []);

const fetchCategorias = async () => {
  try {
    const data = await getActiveCategorias();
    if (data) setCategorias(data);
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
  }
};

const handleAddCategoria = async () => {
  if (!newCategory) {
    alert("El nombre de la categoría no puede estar vacío");
    return;
  }

  try {
    await createCategoria({ descripcion: newCategory });
    fetchCategorias();
    setNewCategory("");
    setOpenModalCategory(false);
  } catch (error) {
    console.error("Error creando categoría:", error);
  }
};

const handleEditCategoria = async (id) => {
  const nuevoNombre = prompt("Editar nombre de la categoría:");
  if (!nuevoNombre) return;

  try {
    await updateCategoria(id, { descripcion: nuevoNombre });
    fetchCategorias();
  } catch (error) {
    console.error("Error editando categoría:", error);
  }
};

const handleDeleteCategoria = async (id) => {
  if (window.confirm("¿Seguro que quieres eliminar esta categoría?")) {
    try {
      await inactivateCategoria(id);
      fetchCategorias();
    } catch (error) {
      console.error("Error eliminando categoría:", error);
    }
  }
};

  const [openModalPoints, setOpenModalPoints] = useState(false);
  const [openModalCategory, setOpenModalCategory] = useState(false);
  const [openModalCaracteristc, setOpenModalCaracteristc] = useState(false);
  const [openModalEvent, setOpenModalEvent] = useState(false);

  const [newCategory, setNewCategory] = useState('');

  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventInitDate, setEventInitDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventCoordinates, setEventCoordinates] = useState('');
  const [events, setEvents] = useState([]);


  const renderContent = () => {
    switch (selectedItem) {
      case 'userManagement':
        return (
          <div className="w-full h-screen">
            <h1 className="mb-10 text-3xl">Gestión de usuarios</h1>
            <div className="flex flex-col gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center gap-4 bg-primary-lightBlue p-4 rounded-xl w-max"
                >
                  <p className="font-semibold text-xl">{user.userName}</p>
                  <button className="bg-red-500 px-4 py-2 rounded-md text-white" onClick={() => handleDeleteUser(user.id)}>
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "touristSpots":
        return (
          <div className="w-full h-screen">
            <div className="flex justify-between mb-6 w-full">
              <h1 className="text-3xl">Gestión de puntos turísticos</h1>
              <button
                onClick={() => setOpenModalPoints(true)}
                className="bg-primary-blue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150"
              >
                Agregar punto turístico
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {puntosTuristicos.map((punto) => (
                <div key={punto.id} className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="font-semibold text-2xl">{punto.descripcion}</h2>
                  <p className="text-gray-600"><strong>Categoría:</strong> {punto.categoria?.descripcion || "Sin categoría"}</p>
                  <p className="text-gray-600"><strong>Ubicación ID:</strong> {punto.ubicacionId}</p>
                  <p className="text-gray-600"><strong>Comentarios:</strong> {punto.comentarios?.length || 0}</p>
                  {punto.pathImagen && (
                    <img src={punto.pathImagen} alt="Imagen punto turístico" className="mt-2 rounded-lg w-full" />
                  )}
                  <div className="flex gap-2 mt-2">
                    <button className="bg-yellow-500 px-4 py-2 rounded-md text-white" onClick={() => handleEditPuntoTuristico(punto)}>
                      <PencilIcon className="w-6 h-6" />
                    </button>
                    <button className="bg-red-500 px-4 py-2 rounded-md text-white" onClick={() => handleDeletePuntoTuristico(punto.id)}>
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal para agregar punto turístico */}
            <ModalCustom introText="Agregar nuevo punto turístico" radius={10} modalState={openModalPoints} handleModalClose={() => setOpenModalPoints(false)}>
              <div className="flex flex-col gap-3 p-6">
                <input
                  placeholder="Nombre del lugar"
                  className="p-4 rounded-md outline-none"
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                />
                <input
                  placeholder="Coordenadas del lugar"
                  className="p-4 rounded-md outline-none"
                  value={newPlaceCoordinates}
                  onChange={(e) => setNewPlaceCoordinates(e.target.value)}
                />
                <input
                  placeholder="URL de la imagen (opcional)"
                  className="p-4 rounded-md outline-none"
                  value={imagePath}
                  onChange={(e) => setImagePath(e.target.value)}
                />
                <input
                  placeholder="Comentarios separados por comas (opcional)"
                  className="p-4 rounded-md outline-none"
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                />
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="p-4 rounded-md outline-none"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.descripcion}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedUbicacionId}
                  onChange={(e) => setSelectedUbicacionId(e.target.value)}
                  className="p-4 rounded-md outline-none"
                >
                  <option value="">Seleccionar ubicación</option>
                  {/* Aquí deberías cargar las ubicaciones desde la API */}
                  <option value="1">Ubicación 1</option>
                  <option value="2">Ubicación 2</option>
                </select>

                <button onClick={handleAddPuntoTuristico} className="bg-primary-darkBlue mt-4 p-2 rounded-lg text-white">
                  Agregar
                </button>
              </div>
            </ModalCustom>
          </div>
        );
        case "categoryManagement":
          return (
            <div className="w-full h-screen">
              <div className="flex justify-between mb-6 w-full">
                <h1 className="text-3xl">Gestión de categorías</h1>
                <button
                  onClick={() => setOpenModalCategory(true)}
                  className="bg-primary-blue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150"
                >
                  Agregar categoría
                </button>
              </div>
              <div className="flex flex-col justify-center gap-4">
                {categorias.map((category) => (
                  <div key={category.id} className="flex justify-between items-center bg-primary-blue p-4 rounded-lg w-max">
                    <span className="text-white text-2xl">{category.descripcion}</span>
                    <div className="flex pl-4">
                      <button
                        className="bg-yellow-500 mr-2 px-2 py-1 rounded-md text-white"
                        onClick={() => handleEditCategoria(category)}
                      >
                        <PencilIcon className="w-6 h-6" />
                      </button>
                      <button
                        className="bg-red-500 px-2 py-1 rounded-md text-white"
                        onClick={() => handleDeleteCategoria(category.id)}
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
        
              {/* Modal para agregar categoría */}
              <ModalCustom introText="Agregar nueva categoría" radius={10} modalState={openModalCategory} handleModalClose={() => setOpenModalCategory(false)}>
                <div className="flex flex-col gap-3 p-6">
                  <input
                    onChange={(e) => setNewCategory(e.target.value)}
                    value={newCategory}
                    placeholder="Nombre categoría"
                    className="p-4 rounded-md outline-none"
                  />
                  <button onClick={handleAddCategoria} className="bg-primary-darkBlue mt-4 p-2 rounded-lg text-white">
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
            <h1 className='text-3xl'>Gestión de eventos</h1>
            <button
              onClick={() => setOpenModalEvent(true)}
              className='bg-primary-blue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150'
            >
              Agregar evento
            </button>
          </div>

          {/* List of Events */}
          <div className='flex flex-col gap-4 mt-4'>
            {events.length > 0 ? (
              events.map((event, index) => (
                <div key={index} className='p-4 border rounded-lg'>
                  <h2 className='font-semibold text-xl'>{event.name}</h2>
                  <p>{event.description}</p>
                  <p>
                    <strong>Fecha de inicio:</strong> {new Date(event.initDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Fecha de fin:</strong> {new Date(event.endDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Coordenadas:</strong> {event.coordinates}
                  </p>
                  <div className='flex gap-4 mt-2'>
                    <button onClick={() => handleEditEvent(index)} className='bg-yellow-500 px-4 py-2 rounded-md'>
                      <PencilIcon className='w-6 h-6' />
                    </button>
                    <button onClick={() => handleDeleteEvent(index)} className='bg-red-500 px-4 py-2 rounded-md'>
                      <TrashIcon className='w-6 h-6' />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay eventos agregados aún</p>
            )}
          </div>
          <ModalCustom radius={10} modalState={openModalEvent} handleModalClose={() => setOpenModalEvent(false)}>
            <div className='flex flex-col gap-3 p-6'>
              <input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder='Nombre del evento'
                className='p-4 rounded-md outline-none'
              />
              <input
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder='Descripción del evento'
                className='p-4 rounded-md outline-none'
              />
              <input
                value={eventInitDate}
                onChange={(e) => setEventInitDate(e.target.value)}
                placeholder='Fecha de inicio (YYYY-MM-DD)'
                type='date'
                className='p-4 rounded-md outline-none'
              />
              <input
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
                placeholder='Fecha de finalización (YYYY-MM-DD)'
                type='date'
                className='p-4 rounded-md outline-none'
              />
              <input
                value={eventCoordinates}
                onChange={(e) => setEventCoordinates(e.target.value)}
                placeholder='Coordenadas (lat, long)'
                className='p-4 rounded-md outline-none'
              />
              <button
                onClick={handleAddNewEvent}
                className='bg-primary-darkBlue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150'>
                Guardar evento
              </button>
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
