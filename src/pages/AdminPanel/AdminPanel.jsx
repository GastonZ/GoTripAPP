import React, { useState, useEffect } from 'react';
import SideMenuAdmin from '../../components/SideMenuAdmin';
import ModalCustom from '../../components/ModalCustom';
import { PencilIcon, TrashIcon, ArrowPathIcon, UserPlusIcon } from '@heroicons/react/20/solid';
import {
  getAllUsuarios,
  activateUsuario,
  updateUsuario,
  inactivateUsuario,
  getAllPuntosTuristicos,
  createPuntoTuristico,
  updatePuntoTuristico,
  inactivatePuntoTuristico,
  activatePuntoTuristico,
  getActiveCategorias,
  createCategoria,
  updateCategoria,
  inactivateCategoria,
  deleteCategoria,
  activateCategoria,
  getAllEventos,
  createEvento,
  updateEvento,
  inactivateEvento,
  activateEvento,
  uploadPuntoTuristicoImages,
  createUsuario
} from '../../service/goTripService';
import { Image } from 'lucide-react';

const AdminPanel = () => {
  const [selectedItem, setSelectedItem] = useState('userManagement');

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    userName: "",
    password: "",
    email: "",
    telefono: "",
    documento: "",
    fechaNacimiento: "",
    state: 1,
    isNoVidente: false,
    isAdmin: false
  });

  console.log(users)

  console.log(selectedUser);

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
    if (window.confirm("¿Estás seguro que deseas inhabilitar este usuario?")) {
      try {
        await inactivateUsuario(id);
        fetchUsuarios();
      } catch (error) {
        console.error("Error inhabilitando usuario:", error);
      }
    }
  };

  const handleActivateUser = async (id) => {
    if (window.confirm("¿Deseas activar este usuario?")) {
      try {
        await activateUsuario(id);
        fetchUsuarios();
      } catch (error) {
        console.error("Error activando usuario:", error);
      }
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleSaveUser = async () => {
    try {
      await updateUsuario(selectedUser.id, selectedUser);
      fetchUsuarios();
      setOpenModal(false);
    } catch (error) {
      console.error("Error actualizando usuario:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUsuario(newUser);
      fetchUsuarios();
      setOpenCreateModal(false);
      setNewUser({
        userName: "",
        password: "",
        email: "",
        telefono: "",
        documento: "",
        fechaNacimiento: "",
        state: 1,
        isNoVidente: false,
        isAdmin: false
      });
    } catch (error) {
      console.error("Error creando usuario:", error);
    }
  };

  const [puntosTuristicos, setPuntosTuristicos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [openModalTourist, setOpenModalToursit] = useState(false);
  const [selectedPunto, setSelectedPunto] = useState(null);

  // Estado para el formulario de nuevo punto turístico
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceDescription, setNewPlaceDescription] = useState("");
  const [newPlaceLatitude, setNewPlaceLatitude] = useState("");
  const [newPlaceLongitude, setNewPlaceLongitude] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

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

  const fetchCategorias = async () => {
    try {
      const data = await getActiveCategorias();
      setCategorias(data || []);
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
      setCategorias([]);
    }
  };

  const handleAddPuntoTuristico = async () => {
    if (!newPlaceName || !selectedCategoryId || !newPlaceLatitude || !newPlaceLongitude) {
      alert("Por favor, completa todos los campos obligatorios");
      return;
    }

    const nuevoPunto = {
      nombre: newPlaceName,
      usuarioId: 1,
      descripcion: newPlaceDescription,
      categoriaId: parseInt(selectedCategoryId),
      latitud: newPlaceLatitude,
      longitud: newPlaceLongitude
    };

    try {
      await createPuntoTuristico(nuevoPunto);
      fetchPuntosTuristicos();
      setOpenModalToursit(false);
      setNewPlaceName("");
      setNewPlaceDescription("");
      setSelectedCategoryId("");
      setNewPlaceLatitude("");
      setNewPlaceLongitude("");
    } catch (error) {
      console.error("Error creando punto turístico:", error);
    }
  };

  const handleEditPuntoTuristico = (punto) => {
    setSelectedPunto(punto);
    setOpenModalToursit(true);
  };

  const handleSavePuntoTuristico = async () => {
    if (!selectedPunto.nombre || !selectedPunto.latitud || !selectedPunto.longitud || !selectedPunto.categoriaId) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    try {
      await updatePuntoTuristico(selectedPunto.id, selectedPunto);
      fetchPuntosTuristicos();
      setOpenModalToursit(false);
    } catch (error) {
      console.error("Error actualizando punto turístico:", error);
    }
  };

  const handleDeletePuntoTuristico = async (id) => {
    if (window.confirm("¿Seguro que quieres desactivar este punto turístico?")) {
      try {
        await inactivatePuntoTuristico(id);
        fetchPuntosTuristicos();
      } catch (error) {
        console.error("Error desactivando punto turístico:", error);
      }
    }
  };

  const handleActivatePuntoTuristico = async (id) => {
    if (window.confirm("¿Deseas activar este punto turístico?")) {
      try {
        await activatePuntoTuristico(id);
        fetchPuntosTuristicos();
      } catch (error) {
        console.error("Error activando punto turístico:", error);
      }
    }
  };

  const [openModalImage, setOpenModalImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPuntoId, setSelectedPuntoId] = useState(null);

  const handleOpenImageModal = (id) => {
    setSelectedPuntoId(id);
    setOpenModalImage(true);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadImage = async () => {
    if (!selectedFile || !selectedPuntoId) {
      alert("Por favor selecciona una imagen.");
      return;
    }

    try {
      await uploadPuntoTuristicoImages(selectedPuntoId, selectedFile);
      fetchPuntosTuristicos()
      alert("Imagen subida con éxito.");
      setOpenModalImage(false);
      setSelectedFile(null);
    } catch (error) {
      alert("Error al subir la imagen.");
    }
  };

  const [newCategory, setNewCategory] = useState("");
  const [openModalCategory, setOpenModalCategory] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const handleAddCategoria = async () => {
    if (!newCategory.trim()) {
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

  const handleEditCategoria = (categoria) => {
    setSelectedCategoria(categoria);
    setNewCategory(categoria.descripcion);
    setOpenModalCategory(true);
  };

  const handleSaveCategoria = async () => {
    if (!selectedCategoria.descripcion.trim()) {
      alert("El nombre de la categoría no puede estar vacío");
      return;
    }

    try {
      await updateCategoria(selectedCategoria.id, { id: selectedCategoria.id, descripcion: selectedCategoria.descripcion, state: 1 });
      fetchCategorias();
      setSelectedCategoria(null);
      setOpenModalCategory(false);
    } catch (error) {
      console.error("Error editando categoría:", error);
    }
  };

  const handleDeleteCategoria = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta categoría permanentemente?")) {
      try {
        await deleteCategoria(id);
        await fetchCategorias();
      } catch (error) {
        console.error("Error eliminando categoría:", error);
      }
    }
  };

  const handleInactivateCategoria = async (id) => {
    if (window.confirm("¿Seguro que quieres desactivar esta categoría?")) {
      try {
        await inactivateCategoria(id);
        fetchCategorias();
      } catch (error) {
        console.error("Error desactivando categoría:", error);
      }
    }
  };

  const handleActivateCategoria = async (id) => {
    if (window.confirm("¿Deseas activar esta categoría?")) {
      try {
        await activateCategoria(id);
        fetchCategorias();
      } catch (error) {
        console.error("Error activando categoría:", error);
      }
    }
  };

  const [openModalPoints, setOpenModalPoints] = useState(false);
  const [openModalCaracteristc, setOpenModalCaracteristc] = useState(false);

  const [events, setEvents] = useState([]);
  const [openModalEvent, setOpenModalEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Estado del formulario
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventInitDate, setEventInitDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLatitude, setEventLatitude] = useState("");
  const [eventLongitude, setEventLongitude] = useState("");
  const [eventCategoryId, setEventCategoryId] = useState("");

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const data = await getAllEventos();
      setEvents(data || []); // Si no hay datos, aseguramos que el estado sea un array vacío
    } catch (error) {
      console.error("Error obteniendo eventos:", error);
      setEvents([]);
    }
  };

  const handleAddNewEvent = async () => {
    if (!eventName || !eventDescription || !eventInitDate || !eventEndDate || !eventLatitude || !eventLongitude || !eventCategoryId) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const newEvent = {
      usuarioId: 1,
      nombre: eventName,
      descripcion: eventDescription,
      fechaInicio: `${eventInitDate}T00:00:00.000Z`,
      fechaFin: `${eventEndDate}T00:00:00.000Z`,
      latitud: eventLatitude,
      longitud: eventLongitude,
      categoriaId: parseInt(eventCategoryId),
    };

    try {
      await createEvento(newEvent);
      fetchEventos();
      setOpenModalEvent(false);
      resetForm();
    } catch (error) {
      console.error("Error creando evento:", error);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEventName(event.nombre);
    setEventDescription(event.descripcion);
    setEventInitDate(event.fechaInicio.split("T")[0]); // Extrae solo la fecha
    setEventEndDate(event.fechaFin.split("T")[0]);
    setEventLatitude(event.latitud);
    setEventLongitude(event.longitud);
    setEventCategoryId(event.categoriaId);
    setOpenModalEvent(true);
  };

  const handleSaveEvent = async () => {
    if (!selectedEvent || !eventName || !eventDescription || !eventInitDate || !eventEndDate || !eventLatitude || !eventLongitude || !eventCategoryId) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const updatedEvent = {
      ...selectedEvent,
      nombre: eventName,
      descripcion: eventDescription,
      fechaInicio: `${eventInitDate}T00:00:00.000Z`,
      fechaFin: `${eventEndDate}T00:00:00.000Z`,
      latitud: eventLatitude,
      longitud: eventLongitude,
      categoriaId: parseInt(eventCategoryId),
    };

    try {
      await updateEvento(selectedEvent.id, updatedEvent);
      fetchEventos();
      setOpenModalEvent(false);
      resetForm();
    } catch (error) {
      console.error("Error actualizando evento:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("¿Seguro que quieres desactivar este evento?")) {
      try {
        await inactivateEvento(id);
        fetchEventos();
      } catch (error) {
        console.error("Error desactivando evento:", error);
      }
    }
  };

  const handleActivateEvent = async (id) => {
    if (window.confirm("¿Deseas activar este evento?")) {
      try {
        await activateEvento(id);
        fetchEventos();
      } catch (error) {
        console.error("Error activando evento:", error);
      }
    }
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setEventName("");
    setEventDescription("");
    setEventInitDate("");
    setEventEndDate("");
    setEventLatitude("");
    setEventLongitude("");
    setEventCategoryId("");
  };

  console.log(categorias);
  console.log(puntosTuristicos);

  const renderContent = () => {
    switch (selectedItem) {
      case 'userManagement':
        return (
          <div className="p-6 w-full h-screen">
            <h1 className="mb-6 text-3xl">Gestión de Usuarios</h1>
            <button
              className="flex items-center gap-2 bg-blue-500 mb-6 px-4 py-2 rounded-md text-white"
              onClick={() => setOpenCreateModal(true)}
            >
              <UserPlusIcon className="w-5 h-5" />
              Crear Usuario
            </button>
            {/* Usuarios Activos */}
            <div className='flex gap-4'>
              <div>
                <h2 className="mb-4 font-semibold text-2xl">Usuarios Activos</h2>
                <div className="flex flex-col gap-4">
                  {users.filter(user => user.state === 1).map((user) => (
                    <div key={user.id} className="flex justify-between items-center gap-4 bg-green-100 p-4 rounded-xl w-max">
                      <p className="font-semibold text-xl">{user.userName}</p>
                      <button className="bg-yellow-500 px-4 py-2 rounded-md text-white" onClick={() => handleEditUser(user)}>
                        <PencilIcon className="w-6 h-6" />
                      </button>
                      <button className="bg-red-500 px-4 py-2 rounded-md text-white" onClick={() => handleDeleteUser(user.id)}>
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usuarios Inactivos */}
              <div>
                <h2 className="mb-4 font-semibold text-2xl">Usuarios Inactivos</h2>
                <div className="flex flex-col gap-4">
                  {users.filter(user => user.state === 2).map((user) => (
                    <div key={user.id} className="flex justify-between items-center gap-4 bg-gray-200 p-4 rounded-xl w-max">
                      <p className="font-semibold text-xl">{user.userName}</p>
                      <button className="bg-blue-500 px-4 py-2 rounded-md text-white" onClick={() => handleActivateUser(user.id)}>
                        Activar
                      </button>
                      <button className="bg-yellow-500 px-4 py-2 rounded-md text-white" onClick={() => handleEditUser(user)}>
                        <PencilIcon className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Modal para Editar Usuario */}
            {openModal && (
              <ModalCustom
                introText="Editar Usuario"
                radius={10}
                modalState={openModal}
                handleModalClose={() => setOpenModal(false)}
              >
                <div className="p-4">
                  <label className="block font-bold">Nombre de usuario:</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={selectedUser.userName}
                    onChange={(e) => setSelectedUser({ ...selectedUser, userName: e.target.value })}
                  />

                  <label className="block mt-2 font-bold">Correo Electrónico:</label>
                  <input
                    type="email"
                    className="p-2 border rounded-md w-full"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />

                  <label className="block mt-2 font-bold">Teléfono:</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={selectedUser.telefono}
                    onChange={(e) => setSelectedUser({ ...selectedUser, telefono: e.target.value })}
                  />

                  <label className="block mt-2 font-bold">Documento:</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={selectedUser.documento}
                    onChange={(e) => setSelectedUser({ ...selectedUser, documento: e.target.value })}
                  />

                  <label className="block mt-2 font-bold">Fecha de Nacimiento:</label>
                  <input
                    type="date"
                    className="p-2 border rounded-md w-full"
                    value={selectedUser.fechaNacimiento.split("T")[0]}
                    onChange={(e) => setSelectedUser({ ...selectedUser, fechaNacimiento: e.target.value })}
                  />

                  <label className="block mt-2 font-bold">Estado:</label>
                  <select
                    className="p-2 border rounded-md w-full"
                    value={selectedUser.state}
                    onChange={(e) => setSelectedUser({ ...selectedUser, state: parseInt(e.target.value) })}
                  >
                    <option value={1}>Activo</option>
                    <option value={2}>Inactivo</option>
                  </select>

                  <label className="block mt-2 font-bold">Es No Vidente:</label>
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={selectedUser.isNoVidente}
                    onChange={(e) => setSelectedUser({ ...selectedUser, isNoVidente: e.target.checked })}
                  />

                  <label className="block mt-2 font-bold">Es Admin:</label>
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={selectedUser.isAdmin}
                    onChange={(e) => setSelectedUser({ ...selectedUser, isAdmin: e.target.checked })}
                  />

                  <div className="flex gap-4 mt-4">
                    <button className="bg-green-500 px-4 py-2 rounded-md text-white" onClick={handleSaveUser}>
                      Guardar
                    </button>
                    <button className="bg-gray-500 px-4 py-2 rounded-md text-white" onClick={() => setOpenModal(false)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </ModalCustom>
            )}

            {openCreateModal && (
              <ModalCustom
                introText="Crear Nuevo Usuario"
                radius={10}
                modalState={openCreateModal}
                handleModalClose={() => setOpenCreateModal(false)}
              >
                <div className="p-4">
                  <label className="block font-bold">Nombre de usuario:</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={newUser.userName}
                    onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
                    required
                  />

                  <label className="block mt-2 font-bold">Contraseña:</label>
                  <input
                    type="password"
                    className="p-2 border rounded-md w-full"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />

                  <label className="block mt-2 font-bold">Correo Electrónico:</label>
                  <input
                    type="email"
                    className="p-2 border rounded-md w-full"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />

                  <label className="block mt-2 font-bold">Teléfono:</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={newUser.telefono}
                    onChange={(e) => setNewUser({ ...newUser, telefono: e.target.value })}
                    required
                  />

                  <label className="block mt-2 font-bold">Documento:</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={newUser.documento}
                    onChange={(e) => setNewUser({ ...newUser, documento: e.target.value })}
                  />

                  <label className="block mt-2 font-bold">Fecha de Nacimiento:</label>
                  <input
                    type="date"
                    className="p-2 border rounded-md w-full"
                    value={newUser.fechaNacimiento}
                    onChange={(e) => setNewUser({ ...newUser, fechaNacimiento: e.target.value })}
                    required
                  />

                  {/* Estado (Siempre 1) */}
                  <input type="hidden" value={1} />

                  {/* Checkboxes */}
                  <div className="flex items-center gap-2 mt-4">
                    <label className="font-bold">¿Es No Vidente?</label>
                    <input
                      type="checkbox"
                      checked={newUser.isNoVidente}
                      onChange={(e) => setNewUser({ ...newUser, isNoVidente: e.target.checked })}
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <label className="font-bold">¿Es Administrador?</label>
                    <input
                      type="checkbox"
                      checked={newUser.isAdmin}
                      onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex gap-4 mt-4">
                    <button className="bg-blue-500 px-4 py-2 rounded-md text-white" onClick={handleCreateUser}>
                      Crear
                    </button>
                    <button className="bg-gray-500 px-4 py-2 rounded-md text-white" onClick={() => setOpenCreateModal(false)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </ModalCustom>
            )}

          </div>
        );
      case "touristSpots":
        return (
          <div className="p-6 w-full h-screen">
            <div className="flex justify-between mb-6">
              <h1 className="text-3xl">Gestión de Puntos Turísticos</h1>
              <button onClick={() => setOpenModalToursit(true)} className="bg-primary-blue px-6 py-2 rounded-2xl text-white duration-150">
                Agregar Punto Turístico
              </button>
            </div>

            {/* Lista de Puntos Turísticos */}
            <div className="flex flex-col gap-6">
              {puntosTuristicos.map((punto) => (
                <div key={punto.id} className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="font-semibold text-2xl">{punto.nombre}</h2>
                  <p><strong>Descripción:</strong> {punto.descripcion}</p>
                  <p><strong>Categoría:</strong> {punto.categoria?.descripcion || "Sin categoría"}</p>
                  <p><strong>Ubicación:</strong> Lat: {punto.latitud}, Lon: {punto.longitud}</p>
                  <p><strong>Imagen path:</strong>{punto.pathImagen ? punto.pathImagen : 'No se cargo una imagen'}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-yellow-500 px-4 py-2 rounded-md text-white" onClick={() => handleEditPuntoTuristico(punto)}>
                      <PencilIcon className="w-6 h-6" />
                    </button>
                    {punto.state === 1 ? (
                      <button className="bg-red-500 px-4 py-2 rounded-md text-white" onClick={() => handleDeletePuntoTuristico(punto.id)}>
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    ) : (
                      <button className="bg-green-500 px-4 py-2 rounded-md text-white" onClick={() => handleActivatePuntoTuristico(punto.id)}>
                        <ArrowPathIcon className="w-6 h-6" />
                      </button>
                    )}
                    <button onClick={() => handleOpenImageModal(punto.id)} className="bg-green-500 px-4 py-2 rounded-md text-white">
                      <Image className='w-6 h-6' />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {openModalImage && (
              <ModalCustom
                introText="Subir imagen al punto turístico"
                radius={10}
                modalState={openModalImage}
                handleModalClose={() => setOpenModalImage(false)}
              >
                <div className="flex flex-col gap-4 p-6">
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  <button
                    onClick={handleUploadImage}
                    className="bg-primary-darkBlue mt-4 p-2 rounded-lg text-white"
                  >
                    Subir Imagen
                  </button>
                </div>
              </ModalCustom>
            )}

            {/* Modal para agregar/editar punto turístico */}
            {openModalTourist && (
              <ModalCustom
                introText={selectedPunto ? "Editar Punto Turístico" : "Agregar Punto Turístico"}
                radius={10}
                modalState={openModalTourist}
                handleModalClose={() => setOpenModalToursit(false)}
              >
                <div className="flex flex-col gap-3 p-4">
                  {/* Nombre del punto turístico */}
                  <label className="font-bold">Nombre:</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    placeholder="Nombre"
                    value={selectedPunto ? selectedPunto.nombre : newPlaceName}
                    onChange={(e) => selectedPunto ? setSelectedPunto({ ...selectedPunto, nombre: e.target.value }) : setNewPlaceName(e.target.value)}
                  />

                  {/* Descripción */}
                  <label className="font-bold">Descripción:</label>
                  <textarea
                    className="p-2 border rounded-md w-full"
                    placeholder="Descripción"
                    value={selectedPunto ? selectedPunto.descripcion : newPlaceDescription}
                    onChange={(e) => selectedPunto ? setSelectedPunto({ ...selectedPunto, descripcion: e.target.value }) : setNewPlaceDescription(e.target.value)}
                  />

                  {/* Latitud */}
                  <label className="font-bold">Latitud:</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    placeholder="Latitud"
                    value={selectedPunto ? selectedPunto.latitud : newPlaceLatitude}
                    onChange={(e) => selectedPunto ? setSelectedPunto({ ...selectedPunto, latitud: e.target.value }) : setNewPlaceLatitude(e.target.value)}
                  />

                  {/* Longitud */}
                  <label className="font-bold">Longitud:</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    placeholder="Longitud"
                    value={selectedPunto ? selectedPunto.longitud : newPlaceLongitude}
                    onChange={(e) => selectedPunto ? setSelectedPunto({ ...selectedPunto, longitud: e.target.value }) : setNewPlaceLongitude(e.target.value)}
                  />

                  {/* Selección de categoría */}
                  <label className="font-bold">Categoría:</label>
                  <select
                    className="p-2 border rounded-md w-full"
                    value={selectedPunto ? selectedPunto.categoriaId : selectedCategoryId}
                    onChange={(e) => selectedPunto ? setSelectedPunto({ ...selectedPunto, categoriaId: parseInt(e.target.value) }) : setSelectedCategoryId(e.target.value)}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.descripcion}
                      </option>
                    ))}
                  </select>

                  {/* Botón para guardar o agregar */}
                  <button
                    onClick={selectedPunto ? handleSavePuntoTuristico : handleAddPuntoTuristico}
                    className="bg-primary-blue mt-4 p-2 rounded-lg w-full text-white"
                  >
                    {selectedPunto ? "Guardar Cambios" : "Agregar"}
                  </button>
                </div>
              </ModalCustom>
            )}
          </div>
        );
      case "categoryManagement":
        return (
          <div className="p-6 w-full h-screen">
            <div className="flex justify-between mb-6">
              <h1 className="text-3xl">Gestión de Categorías</h1>
              <button
                onClick={() => {
                  setSelectedCategoria(null);
                  setNewCategory("");
                  setOpenModalCategory(true);
                }}
                className="bg-primary-blue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150"
              >
                Agregar Categoría
              </button>
            </div>

            {/* Categorías Activas */}
            <h2 className="mb-4 font-semibold text-2xl">Categorías</h2>
            {categorias.length === 0 ? (
              <div className="text-gray-600">Sin categorías creadas</div>
            ) : (
              <div className="flex flex-col gap-4">
                {categorias.map((category) => (
                  <div key={category.id} className="flex justify-between items-center bg-primary-blue p-4 rounded-lg w-max">
                    <span className="text-white text-2xl">{category.descripcion}</span>
                    <div className="flex pl-4">
                      <button className="bg-yellow-500 mr-2 px-2 py-1 rounded-md text-white" onClick={() => handleEditCategoria(category)}>
                        <PencilIcon className="w-6 h-6" />
                      </button>
                      {/*                       <button className="bg-gray-500 px-2 py-1 rounded-md text-white" onClick={() => handleInactivateCategoria(category.id)}>
                        Desactivar
                      </button> */}
                      <button className="bg-red-500 px-2 py-1 rounded-md text-white" onClick={() => handleInactivateCategoria(category.id)}>
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Categorías Inactivas */}
            <h2 className="mt-8 mb-4 font-semibold text-2xl">Categorías Inactivas</h2>
            {categorias.filter(cat => cat.state === 2).length === 0 ? (
              <div className="text-gray-600">Sin categorías inactivas</div>
            ) : (
              <div className="flex flex-col gap-4">
                {categorias.filter(cat => cat.state === 2).map((category) => (
                  <div key={category.id} className="flex justify-between items-center bg-gray-400 p-4 rounded-lg w-max">
                    <span className="text-white text-2xl">{category.descripcion}</span>
                    <div className="flex pl-4">
                      <button className="bg-green-500 px-2 py-1 rounded-md text-white" onClick={() => handleActivateCategoria(category.id)}>
                        <ArrowPathIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal para agregar/editar categoría */}
            {openModalCategory && (
              <ModalCustom
                introText={selectedCategoria ? "Editar Categoría" : "Agregar Categoría"}
                radius={10}
                modalState={openModalCategory}
                handleModalClose={() => setOpenModalCategory(false)}
              >
                <div className="flex flex-col gap-3 p-4">
                  {/* Nombre de la categoría */}
                  <label className="font-bold">Nombre de la Categoría:</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    placeholder="Nombre de la categoría"
                    value={selectedCategoria ? selectedCategoria.descripcion : newCategory}
                    onChange={(e) => selectedCategoria ? setSelectedCategoria({ ...selectedCategoria, descripcion: e.target.value }) : setNewCategory(e.target.value)}
                  />

                  {/* Botón para guardar o agregar */}
                  <button
                    onClick={selectedCategoria ? handleSaveCategoria : handleAddCategoria}
                    className="bg-primary-blue mt-4 p-2 rounded-lg w-full text-white"
                  >
                    {selectedCategoria ? "Guardar Cambios" : "Agregar"}
                  </button>
                </div>
              </ModalCustom>
            )}
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
        return (
          <div className="p-6 w-full h-screen">
            <div className="flex justify-between mb-6 w-full">
              <h1 className="text-3xl">Gestión de Eventos</h1>
              <button onClick={() => setOpenModalEvent(true)} className="bg-primary-blue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150">
                Agregar Evento
              </button>
            </div>

            {/* Lista de eventos */}
            {events.length === 0 ? (
              <p className="text-gray-600">No hay eventos agregados aún</p>
            ) : (
              <div className="flex flex-col gap-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-gray-100 p-4 border rounded-lg">
                    <h2 className="font-semibold text-xl">{event.nombre}</h2>
                    <p>{event.descripcion}</p>
                    <p><strong>Fecha de inicio:</strong> {new Date(event.fechaInicio).toLocaleDateString()}</p>
                    <p><strong>Fecha de fin:</strong> {new Date(event.fechaFin).toLocaleDateString()}</p>
                    <p><strong>Coordenadas:</strong> {event.latitud}, {event.longitud}</p>
                    <div className="flex gap-4 mt-2">
                      <button onClick={() => handleEditEvent(event)} className="bg-yellow-500 px-4 py-2 rounded-md text-white">
                        <PencilIcon className="w-6 h-6" />
                      </button>
                      {event.state === 1 ? (
                        <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-500 px-4 py-2 rounded-md text-white">
                          <TrashIcon className="w-6 h-6" />
                        </button>
                      ) : (
                        <button onClick={() => handleActivateEvent(event.id)} className="bg-green-500 px-4 py-2 rounded-md text-white">
                          <ArrowPathIcon className="w-6 h-6" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal para agregar/editar evento */}
            {openModalEvent && (
              <ModalCustom introText={selectedEvent ? "Editar Evento" : "Agregar Evento"} radius={10} modalState={openModalEvent} handleModalClose={() => setOpenModalEvent(false)}>
                <div className="flex flex-col gap-3 p-6">
                  <input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Nombre del evento" className="p-4 rounded-md outline-none" />
                  <input value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Descripción del evento" className="p-4 rounded-md outline-none" />
                  <input value={eventInitDate} onChange={(e) => setEventInitDate(e.target.value)} type="date" className="p-4 rounded-md outline-none" />
                  <input value={eventEndDate} onChange={(e) => setEventEndDate(e.target.value)} type="date" className="p-4 rounded-md outline-none" />
                  <input value={eventLatitude} onChange={(e) => setEventLatitude(e.target.value)} placeholder="Latitud" className="p-4 rounded-md outline-none" />
                  <input value={eventLongitude} onChange={(e) => setEventLongitude(e.target.value)} placeholder="Longitud" className="p-4 rounded-md outline-none" />
                  <select value={eventCategoryId} onChange={(e) => setEventCategoryId(e.target.value)} className="p-4 border rounded-md outline-none">
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                    ))}
                  </select>
                  <button onClick={selectedEvent ? handleSaveEvent : handleAddNewEvent} className="bg-primary-darkBlue px-6 py-2 rounded-2xl text-white hover:scale-105 duration-150">
                    {selectedEvent ? "Guardar Cambios" : "Guardar Evento"}
                  </button>
                </div>
              </ModalCustom>
            )}
          </div>
        );
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
