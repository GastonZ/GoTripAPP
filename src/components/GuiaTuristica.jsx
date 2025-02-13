import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";

const socket = io("http://localhost:3001");

export default function GuiaTuristica() {
  const [ubicacion, setUbicacion] = useState(null);
  const [destino, setDestino] = useState(null);
  const [modoDesarrollador, setModoDesarrollador] = useState(false);
  const [escuchando, setEscuchando] = useState(false);
  const [hablando, setHablando] = useState(false);
  const [respuestaIA, setRespuestaIA] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator && !modoDesarrollador) {
      navigator.geolocation.watchPosition(
        (position) => {
          const nuevaUbicacion = {
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
          };
          setUbicacion(nuevaUbicacion);
          socket.emit("ubicacion", nuevaUbicacion);
        },
        (error) => console.error("⚠️ Error obteniendo ubicación:", error),
        { enableHighAccuracy: true }
      );
    }
  }, [modoDesarrollador]);

  useEffect(() => {
    socket.on("destino", (data) => setDestino(data));
    socket.on("respuesta", (data) => {
      console.log("📢 Respuesta de la IA recibida:", data.respuesta);
      setRespuestaIA(data.respuesta);
      hablar(data.respuesta);
    });

    return () => {
      socket.off("destino");
      socket.off("respuesta");
    };
  }, []);

  const ManejadorMapa = () => {
    useMapEvents({
      click(e) {
        if (modoDesarrollador) {
          const nuevaUbicacion = { latitud: e.latlng.lat, longitud: e.latlng.lng };
          setUbicacion(nuevaUbicacion);
          socket.emit("ubicacion_manual", nuevaUbicacion);
        }
      },
    });
    return null;
  };

  const iniciarReconocimiento = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true; // ✅ Se mantiene activo después de responder
    recognition.interimResults = false;

    recognition.onstart = () => setEscuchando(true);
    recognition.onend = () => setEscuchando(false);

    recognition.onresult = (event) => {
      if (hablando) return; // ✅ No interrumpe si la IA está hablando

      const mensaje = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log(`🎤 Usuario dijo: ${mensaje}`);
      socket.emit("mensaje", { mensaje, ubicacion });
    };

    recognition.start();
  };

  const hablar = (texto) => {
    if (!window.speechSynthesis) {
      console.error("❌ La síntesis de voz no está disponible en este navegador.");
      return;
    }

    setHablando(true);
    const synth = window.speechSynthesis;
    synth.cancel(); // Evita interrupciones previas

    const textoLimpio = texto.replace(/\*\*/g, "").trim();
    const fragmentos = textoLimpio.match(/.{1,200}(\s|$)/g); // ✅ Divide en partes de 200 caracteres

    let indice = 0;
    const reproducirFragmento = () => {
      if (indice < fragmentos.length) {
        const utterance = new SpeechSynthesisUtterance(fragmentos[indice]);
        utterance.lang = "es-ES";
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onerror = (e) => {
          console.error("❌ Error en síntesis de voz:", e);
          synth.cancel();
        };

        utterance.onend = () => {
          indice++;
          if (indice < fragmentos.length) {
            setTimeout(reproducirFragmento, 500);
          } else {
            setHablando(false);
          }
        };

        synth.speak(utterance);
      }
    };

    reproducirFragmento();
  };

  return (
    <div className="flex flex-col items-center p-6 gap-6">
      <div className="w-full max-w-md p-4 text-center border rounded shadow">
        <h2 className="text-xl font-bold">Guía Turística por IA</h2>

        <button
          onClick={() => setModoDesarrollador(!modoDesarrollador)}
          className={`w-full ${modoDesarrollador ? "bg-gray-500" : "bg-blue-500"} text-white p-2 mt-2 rounded`}
        >
          {modoDesarrollador ? "🔧 Desactivar Modo Desarrollador" : "🛠️ Activar Modo Desarrollador"}
        </button>

        {ubicacion && (
          <p className="text-gray-500 mt-2">📍 Ubicación actual: {ubicacion.latitud}, {ubicacion.longitud}</p>
        )}

        {destino && (
          <p className="text-green-500 mt-2">🎯 Destino: {destino.latitud}, {destino.longitud}</p>
        )}

        {modoDesarrollador && (
          <div className="w-full h-96 mt-4">
            <MapContainer
              center={ubicacion ? [ubicacion.latitud, ubicacion.longitud] : [-26.8206, -65.1919]}
              zoom={15}
              className="leaflet-container"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {ubicacion && <Marker position={[ubicacion.latitud, ubicacion.longitud]} />}
              {destino && <Marker position={[destino.latitud, destino.longitud]} />}
              <ManejadorMapa />
            </MapContainer>
          </div>
        )}

        <button
          onClick={iniciarReconocimiento}
          className={`w-full ${escuchando ? "bg-red-500" : "bg-green-500"} text-white p-2 mt-2 rounded`}
        >
          🎤 {escuchando ? "Escuchando..." : "Guíame"}
        </button>
      </div>
    </div>
  );
}
