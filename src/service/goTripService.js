import apiGoTrip from "./api/apiGoTrip";

const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
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

export const uploadPuntoTuristicoImages = (data) => handleRequest(apiGoTrip.post(`/PuntoTuristico/PutImages`, data));
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
