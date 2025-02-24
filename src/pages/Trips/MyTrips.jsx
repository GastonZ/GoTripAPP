import React, { useState, useEffect } from "react";
import MyTripsCard from "../../components/MyTripsCard";
import { getAllPlanViaje, inactivatePlanViaje } from "../../service/goTripService";
import { useGeolocated } from "react-geolocated";

const MyTrips = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapMode, setMapMode] = useState("driving");

  const goUserId = localStorage.getItem("userGoId");

  const [iframeUrl, setIframeUrl] = useState("");

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    if (coords) {
      console.log("Ubicación obtenida:", coords.latitude, coords.longitude);
    }
  }, [coords]);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await getAllPlanViaje();
  
      if (response && Array.isArray(response)) {
        const userTrips = response.filter((trip) => trip.usuarioId == goUserId && trip.state === 1);
        console.log("Planes de viaje activos:", userTrips);
        
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
  

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este plan de viaje?")) return;

    try {
      await inactivatePlanViaje(tripId);
      fetchTrips();
    } catch (error) {
      console.error("Error eliminando el plan de viaje:", error);
      alert("No se pudo eliminar el plan de viaje.");
    }
  };

  const generateIframeUrl = (trip, mode = "driving") => {
    const baseUrl =
      "https://www.google.com/maps/embed/v1/directions?key=AIzaSyAvBg2_LvfISOBrPQI5gIVNkF_65ypu-8k";

    if (!isGeolocationAvailable || !isGeolocationEnabled || !coords) {
      console.error("La geolocalización no está disponible o fue denegada.");
      return "";
    }

    const origin = `${coords.latitude},${coords.longitude}`;
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

    console.log("Coordenadas obtenidas del viaje:", coordinates);

    if (coordinates.length === 0) {
      console.error("No hay ubicaciones válidas para generar el mapa.");
      return "";
    }

    const finalDestination = coordinates[coordinates.length - 1];
    const waypoints = coordinates.length > 1 ? coordinates.slice(0, -1).join("|") : "";

    return `${baseUrl}&origin=${origin}&destination=${finalDestination}${waypoints ? `&waypoints=${waypoints}` : ""}&mode=${mode}`;
  };

  console.log(myTrips[0]);
  
  
  return (
    <main className="flex flex-wrap justify-center items-center h-screen">
      {loading ? (
        <p className="font-semibold text-lg text-center">Cargando viajes...</p>
      ) : error ? (
        <p className="font-semibold text-red-500 text-center">{error}</p>
      ) : myTrips.length === 0 ? (
        <div className="text-center">
          <p className="font-bold text-black text-3xl">Aún no has creado ningún viaje</p>
        </div>
      ) : (
        myTrips.map((trip, index) => (
          <div key={trip.id} className="flex flex-col bg-white shadow-lg mb-6 p-4 rounded-lg w-full max-w-md">
            <h2 className="my-4 font-semibold text-lg">
              {trip.descripcion}
            </h2>
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

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedTripIndex(selectedTripIndex === index ? null : index)}
                className="bg-primary-darkBlue p-2 rounded-lg w-max text-white"
              >
                {selectedTripIndex === index ? "Ocultar mapa" : "Ver en mapa"}
              </button>

              <button
                onClick={() => setMapMode("driving")}
                className={`p-2 rounded-lg w-max ${mapMode === "driving" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
              >
                Ver mapa en auto
              </button>

              <button
                onClick={() => setMapMode("walking")}
                className={`p-2 rounded-lg w-max ${mapMode === "walking" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
              >
                Ver mapa a pie
              </button>

{/*               <button className="bg-yellow-500 p-2 rounded-lg w-max text-white">
                Editar plan de viaje
              </button> */}

              <button
                onClick={() => handleDeleteTrip(trip.id)}
                className="bg-red-500 p-2 rounded-lg w-max text-white"
              >
                Borrar plan de viaje
              </button>
            </div>

            {selectedTripIndex === index && (
              <iframe
                src={generateIframeUrl(trip, mapMode)}
                className="mt-4 w-full h-[500px]"
                style={{ border: 0 }}
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
