import React, { useState, useEffect } from "react";
import MyTripsCard from "../../components/MyTripsCard";
import { getAllPlanViaje } from "../../service/goTripService";

const MyTrips = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goUserId = localStorage.getItem("userGoId");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllPlanViaje();

      if (response && Array.isArray(response)) {
        // Filtrar los planes de viaje del usuario autenticado
        const userTrips = response.filter((trip) => trip.usuarioId == goUserId);
        setMyTrips(userTrips);
      } else {
        setMyTrips([]);
      }
    } catch (err) {
      console.error("Error obteniendo los planes de viaje:", err);
      setError("No se pudieron cargar los planes de viaje.");
    } finally {
      setLoading(false);
    }
  };

  const generateIframeUrl = (trip) => {
    const baseUrl =
      "https://www.google.com/maps/embed/v1/directions?key=AIzaSyAvBg2_LvfISOBrPQI5gIVNkF_65ypu-8k";
    const origin = "current+location";

    const coordinates = trip.lineaPlanViaje
      .map((linea) => {
        if (linea.puntoTuristico) {
          return `${linea.puntoTuristico.latitud},${linea.puntoTuristico.longitud}`;
        }
        if (linea.evento) {
          return `${linea.evento.latitud},${linea.evento.longitud}`;
        }
        return null;
      })
      .filter(Boolean);

    if (coordinates.length < 1) return "";

    const waypoints = coordinates.slice(0, -1).join("|");
    const finalDestination = coordinates[coordinates.length - 1];

    return `${baseUrl}&origin=${origin}&destination=${finalDestination}&waypoints=${waypoints}&mode=driving`;
  };

  return (
    <main className="flex flex-wrap justify-center items-center h-screen">
      {loading ? (
        <p className="font-semibold text-lg text-center">Cargando viajes...</p>
      ) : error ? (
        <p className="font-semibold text-red-500 text-center">{error}</p>
      ) : myTrips.length === 0 ? (
        <div className="text-center">
          <p className="font-bold text-black text-3xl">
            Aún no has creado ningún viaje
          </p>
        </div>
      ) : (
        myTrips.map((trip, index) => (
          <div key={trip.id} className="flex flex-col mb-6">
            <MyTripsCard
              travelPoints={trip.lineaPlanViaje.map((linea) =>
                linea.puntoTuristico
                  ? linea.puntoTuristico.nombre
                  : linea.evento
                  ? linea.evento.nombre
                  : "Lugar desconocido"
              )}
              initDate={trip.fechaInicio}
              endDate={trip.fechaFin}
            />
            <button
              onClick={() =>
                setSelectedTripIndex(selectedTripIndex === index ? null : index)
              }
              className="bg-primary-darkBlue mt-4 p-2 rounded-lg w-max text-white"
            >
              {selectedTripIndex === index ? "Ocultar mapa" : "Ver en mapa"}
            </button>

            {selectedTripIndex === index && (
              <iframe
                src={generateIframeUrl(trip)}
                className="w-full h-[500px]"
                style={{ border: 0, marginTop: "20px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            )}
          </div>
        ))
      )}
    </main>
  );
};

export default MyTrips;
