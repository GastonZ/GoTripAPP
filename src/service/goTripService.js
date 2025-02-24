import apiGoTrip from "./api/apiGoTrip";

const handleRequest = async (request) => {
  try {
    console.log ("🚀 Request:", request);
    const response = await request;
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
    throw error;
  }
};

export const getComentario = (id) => handleRequest(apiGoTrip.get(`/Comentario/${id}`));
export const updateComentario = (id, data) => handleRequest(apiGoTrip.put(`/Comentario/${id}`, data));
export const createComentario = (data) => handleRequest(apiGoTrip.post(`/Comentario`, data));
export const activateComentario = (id) => handleRequest(apiGoTrip.put(`/Comentario/${id}/activate`));
export const inactivateComentario = (id) => handleRequest(apiGoTrip.put(`/Comentario/${id}/inactivate`));

export const getAllEventos = () => handleRequest(apiGoTrip.get(`/Evento/GetAll`));
export const getEvento = (id) => handleRequest(apiGoTrip.get(`/Evento/${id}`));
export const updateEvento = (id, data) => handleRequest(apiGoTrip.put(`/Evento/${id}`, data));
export const createEvento = (data) => handleRequest(apiGoTrip.post(`/Evento`, data));
export const activateEvento = (id) => handleRequest(apiGoTrip.put(`/Evento/${id}/activate`));
export const inactivateEvento = (id) => handleRequest(apiGoTrip.put(`/Evento/${id}/inactivate`));

export const getPlanViaje = (id) => handleRequest(apiGoTrip.get(`/PlanViaje/${id}`));
export const updatePlanViaje = (id, data) => handleRequest(apiGoTrip.put(`/PlanViaje/${id}`, data));
export const createPlanViaje = (data) => handleRequest(apiGoTrip.post(`/PlanViaje`, data));
export const activatePlanViaje = (id) => handleRequest(apiGoTrip.put(`/PlanViaje/${id}/activate`));
export const inactivatePlanViaje = (id) => handleRequest(apiGoTrip.put(`/PlanViaje/${id}/inactivate`));
export const getAllPlanViaje = () => handleRequest(apiGoTrip.get('/PlanViaje/GetAll'))

export const uploadPuntoTuristicoImages = async (id, file) => {
  const formData = new FormData();
  formData.append("images", file);

  try {
    const response = await apiGoTrip.post(`/PuntoTuristico/PutImages?idPuntoTuristico=${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error subiendo la imagen:", error);
    throw error;
  }
};

export const uploadEventImages = async (id, file) => {
  const formData = new FormData();
  formData.append("images", file);

  try {
    const response = await apiGoTrip.post(`/Evento/PutImages?idEvento=${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error subiendo la imagen:", error);
    throw error;
  }
};


export const getAllPuntosTuristicos = () => handleRequest(apiGoTrip.get(`/PuntoTuristico/GetAll`));
export const getPuntoTuristico = (id) => handleRequest(apiGoTrip.get(`/PuntoTuristico/${id}`));
export const updatePuntoTuristico = (id, data) => handleRequest(apiGoTrip.put(`/PuntoTuristico/${id}`, data));
export const createPuntoTuristico = (data) => handleRequest(apiGoTrip.post(`/PuntoTuristico`, data));
export const activatePuntoTuristico = (id) => handleRequest(apiGoTrip.put(`/PuntoTuristico/${id}/activate`));
export const inactivatePuntoTuristico = (id) => handleRequest(apiGoTrip.put(`/PuntoTuristico/${id}/inactivate`));

export const getUsuario = (id) => handleRequest(apiGoTrip.get(`/Usuarios/${id}`));
export const updateUsuario = (id, data) => handleRequest(apiGoTrip.put(`/Usuarios/${id}`, data));
export const getAllUsuarios = () => handleRequest(apiGoTrip.get(`/Usuarios/GetAll`));
export const createUsuario = (data) => handleRequest(apiGoTrip.post(`/Usuarios`, data));
export const activateUsuario = (id) => handleRequest(apiGoTrip.put(`/Usuarios/${id}/activate`));
export const inactivateUsuario = (id) => handleRequest(apiGoTrip.put(`/Usuarios/${id}/inactivate`));

export const createCategoria = (data) => handleRequest(apiGoTrip.post(`/Categoria/alta`, data));
export const updateCategoria = (id, data) => handleRequest(apiGoTrip.put(`/Categoria/update/${id}`, data));
export const deleteCategoria = (id) => handleRequest(apiGoTrip.delete(`/Categoria/delete/${id}`));
export const getActiveCategorias = () => handleRequest(apiGoTrip.get(`/Categoria/active`));
export const getCategoria = (id) => handleRequest(apiGoTrip.get(`/Categoria/${id}`));
export const updateCategoriaById = (id, data) => handleRequest(apiGoTrip.put(`/Categoria/${id}`, data));
export const createCategoriaGeneral = (data) => handleRequest(apiGoTrip.post(`/Categoria`, data));
export const activateCategoria = (id) => handleRequest(apiGoTrip.put(`/Categoria/${id}/activate`));
export const inactivateCategoria = (id) => handleRequest(apiGoTrip.put(`/Categoria/${id}/inactivate`));

export const loginUsuario = async (username, password) => {
  try {
    const response = await apiGoTrip.post(`/Auth/login`, null, {
      params: { username, password }
    });
    return response.data;
  } catch (error) {
    console.error("Error en el login:", error.response ? error.response.data : error.message);
    throw error;
  }
};

