import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";

//PROD
//const socket = io("https://gotripapp-novidente-production-fbbf.up.railway.app/", {
//  transports: ["websocket", "polling"],
//});


//DEV
const socket = io("http://localhost:3001");

export default function GuiaTuristica() {
  const [ubicacion, setUbicacion] = useState(null);
  const [destino, setDestino] = useState(null);
  const [ruta, setRuta] = useState([]);
  const [escuchando, setEscuchando] = useState(false);
  const [hablando, setHablando] = useState(false);
  const [respuestaIA, setRespuestaIA] = useState("");
  const [buscandoDestino, setBuscandoDestino] = useState(false);
  const [enRecorrido, setEnRecorrido] = useState(false);

  //Lamada de emergencia
  const NUMERO_EMERGENCIA = "+5493816610201"; // Reemplázalo con el número de emergencia real


  // 📞 Llamar a contacto de emergencia
  const llamarEmergencia = () => {
    window.location.href = `tel:${NUMERO_EMERGENCIA}`;
  };


  // 🎙️ Mensaje de bienvenida al cargar la app
  useEffect(() => {
    hablar("Bienvenido a la Guía Turística por IA de GoTrip APP.");
  }, []);

  // 📩 Enviar mensaje de emergencia por WhatsApp con ubicación actual
  const enviarMensajeWhatsApp = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitud = position.coords.latitude;
          const longitud = position.coords.longitude;
          const mensaje = encodeURIComponent(
            `⚠️ EMERGENCIA: Necesito ayuda. 📍 Mi ubicación: https://maps.google.com/?q=${latitud},${longitud}`
          );
          const url = `https://wa.me/${NUMERO_EMERGENCIA}?text=${mensaje}`;
          window.open(url, "_blank"); // Abre WhatsApp en una nueva pestaña
        },
        (error) => {
          console.error("❌ Error obteniendo ubicación:", error);
          alert("No se pudo obtener tu ubicación.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Tu dispositivo no soporta geolocalización.");
    }
  };


  useEffect(() => {
    if ("geolocation" in navigator) {
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
  }, []);

  useEffect(() => {
    socket.on("respuesta", (data) => {
      console.log("📢 Respuesta de la IA recibida:", data.respuesta);
      setRespuestaIA(data.respuesta);
      hablar(data.respuesta);

      if (data.destino) setDestino(data.destino);
      if (data.ruta) setRuta(data.ruta);

      if (data.inicio_recorrido) {
        setEnRecorrido(true);
      }
    });

    return () => {
      socket.off("respuesta");
    };
  }, []);

  // 🎤 Función para encontrar destino por voz
  const encontrarDestino = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;  // 🔴 Se asegura de que no siga escuchando tras terminar
    recognition.interimResults = false;

    recognition.onstart = () => {
      setBuscandoDestino(true);
      hablar("Por favor, dime a dónde quieres ir.");
    };

    recognition.onresult = (event) => {
      const mensaje = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log(`🎤 Usuario dijo: ${mensaje}`);
      socket.emit("encontrar_destino", { mensaje });

      recognition.stop();  // 🔴 SE AGREGA AQUÍ PARA DESACTIVAR EL MICRÓFONO DESPUÉS DE HABLAR
    };

    recognition.onend = () => {
      setBuscandoDestino(false);
    };

    recognition.start();
  };


  // 🚶 Función para iniciar el recorrido
  const comenzarRecorrido = () => {
    if (!destino || ruta.length === 0) {
      hablar("Debes encontrar un destino antes de iniciar el recorrido.");
      return;
    }

    setEnRecorrido(true);
    socket.emit("comenzar_recorrido");
  };

  // 🎤 Función para escuchar comandos del usuario
  const escucharComando = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setEscuchando(true);
    recognition.onend = () => setEscuchando(false);

    recognition.onresult = (event) => {
      const mensaje = event.results[0][0].transcript.toLowerCase();
      console.log(`🎤 Usuario dijo: ${mensaje}`);

      if (mensaje.includes("siguiente paso")) {
        socket.emit("siguiente_paso");
      } else if (
        mensaje.includes("repetir pasó") ||
        mensaje.includes("repite el paso") ||
        mensaje.includes("volver a decir el paso") ||
        mensaje.includes("dime otra vez el paso") ||
        mensaje.includes("repetí") ||
        mensaje.includes("repítelo")
      ) {
        socket.emit("repetir_paso");
      } else if (
        mensaje.includes("qué sabes del destino") ||
        mensaje.includes("háblame del destino") ||
        mensaje.includes("qué podrías decirme del destino") ||
        mensaje.includes("quiero saber más sobre este lugar") ||
        mensaje.includes("dame detalles del destino") ||
        mensaje.includes("qué me puedes contar del destino")
      ) {
        socket.emit("detalles_destino");
      } else if (
        mensaje.includes("nuevo destino") ||
        mensaje.includes("cambiar destino") ||
        mensaje.includes("quiero ir a otro destino") ||
        mensaje.includes("ir a otro destino") ||
        mensaje.includes("buscar otro destino") ||
        mensaje.includes("elegir otro destino") ||
        mensaje.includes("nuevo punto turístico") ||
        mensaje.includes("buscar nuevo punto turístico") ||
        mensaje.includes("ir a nueva ubicación") ||
        mensaje.includes("nueva ubicación") ||
        mensaje.includes("nuevo lugar") ||
        mensaje.includes("otro destino")
      ) {
        socket.emit("nuevo_destino");
        // 🔹 Agregar un delay de 400ms antes de ejecutar "encontrarDestino"
        setTimeout(() => {
          encontrarDestino();
        }, 600);
      } else {
        hablar("No entendí el comando. Puedes decir 'siguiente paso', 'repetir paso', 'detalles del destino' o 'nuevo destino'.");
      }
    };

    recognition.start();
  };


  // 🔊 Función para que la IA hable
  const hablar = (texto) => {
    if (!window.speechSynthesis) {
      console.error("❌ La síntesis de voz no está disponible en este navegador.");
      return;
    }

    setHablando(true);
    const synth = window.speechSynthesis;
    synth.cancel(); // Cancelar cualquier audio en progreso

    const fragmentos = texto.match(/.{1,200}(\s|$)/g); // Divide el texto en partes de hasta 200 caracteres sin cortar palabras

    const hablarFragmento = (index) => {
      if (index >= fragmentos.length) {
        setHablando(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(fragmentos[index]);
      utterance.lang = "es-ES";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => hablarFragmento(index + 1); // Llamar al siguiente fragmento después de que termine el actual
      utterance.onerror = (e) => console.error("❌ Error en síntesis de voz:", e);

      synth.speak(utterance);
    };

    hablarFragmento(0); // Iniciar la lectura desde el primer fragmento
  };

  const verManualUsuario = () => {
    const texto = `
    Bienvenido al manual de usuario de la Guía Turística por IA.
  
    Para encontrar un destino, presiona el botón 'Encontrar Destino' y di en voz alta el nombre del lugar al que deseas ir. 
    La IA procesará la información y te indicará si encontró un destino válido.
  
    Una vez que el destino haya sido encontrado, el botón 'Comenzar Recorrido' se habilitará.
    Presiónalo para iniciar la navegación. La IA te dará instrucciones paso a paso para llegar a tu destino.
  
    Durante el recorrido, puedes interactuar con la IA usando el botón 'Hablar con la IA'. 
    Tienes cuatro comandos disponibles:
      - Di 'Siguiente paso' para escuchar la siguiente indicación del recorrido.
      - Di 'Repetir paso' para volver a escuchar la última indicación.
      - Di 'Detalles del destino' para obtener información sobre el lugar al que te diriges.
      - Di 'Nuevo destino' para cancelar la ruta actual y seleccionar un nuevo destino.
  
    En caso de emergencia, puedes utilizar los siguientes botones:
      - 'Llamar a Contacto de Emergencia': Llamará automáticamente a tu contacto de emergencia registrado.
      - 'Enviar Mensaje de Emergencia': Enviará un mensaje con tu ubicación actual a tu contacto de emergencia.
  
    Para repetir esta información en cualquier momento, presiona nuevamente el botón 'Manual de Usuario'.
  
    Ahora puedes empezar a usar la Guía Turística por IA.
    `;

    // Dividimos el texto en fragmentos de hasta 200 caracteres sin cortar palabras
    const fragmentos = texto.match(/.{1,200}(\s|$)/g);

    const synth = window.speechSynthesis;
    synth.cancel(); // Cancelar cualquier audio en progreso

    let index = 0;

    const hablarFragmento = () => {
      if (index >= fragmentos.length) return; // Si terminamos todos los fragmentos, salir

      const utterance = new SpeechSynthesisUtterance(fragmentos[index]);
      utterance.lang = "es-ES";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        index++; // Pasamos al siguiente fragmento
        hablarFragmento(); // Llamamos la función para seguir con el siguiente fragmento
      };

      synth.speak(utterance);
    };

    hablarFragmento(); // Iniciar la lectura desde el primer fragmento
  };



  return (
    <div className="flex flex-col items-center p-6 gap-6">
      <div className="w-full max-w-md p-6 text-center border rounded-lg shadow">
        <h2 className="text-2xl font-bold">Guía Turística por IA</h2>

        {ubicacion && (
          <p className="text-gray-500 mt-4 text-lg">
            Ubicación actual: {ubicacion.latitud}, {ubicacion.longitud}
          </p>
        )}

        {destino && (
          <p className="text-green-500 mt-4 text-lg font-semibold">
            Destino: {destino.nombre} ({destino.latitud}, {destino.longitud})
          </p>
        )}
        {/* 📖 Botón para acceder al Manual de Usuario */}

        <button
          onClick={verManualUsuario}
          className="w-full bg-purple-600 text-white text-lg font-semibold p-4 mt-4 rounded-lg"
        >
          MANUAL DE USUARIO
        </button>

        {/* Botón para encontrar destino por voz */}
        <button
          onClick={encontrarDestino}
          className={`w-full ${buscandoDestino ? "bg-gray-500" : "bg-blue-500"} text-white text-lg font-semibold p-4 mt-4 rounded-lg`}
        >
          {buscandoDestino ? "Escuchando..." : "ENCONTRAR DESTINO"}
        </button>

        {/* Botón para comenzar recorrido */}
        <button
          onClick={comenzarRecorrido}
          className={`w-full ${enRecorrido ? "bg-gray-500" : "bg-green-500"} text-white text-lg font-semibold p-4 mt-4 rounded-lg`}
          disabled={!destino || ruta.length === 0}
        >
          {enRecorrido ? "Recorrido en curso..." : "COMENZAR RECORRIDO"}
        </button>

        {/* Botón para escuchar comandos de voz */}
        <button
          onClick={escucharComando}
          className="w-full bg-yellow-500 text-white text-lg font-semibold p-4 mt-4 rounded-lg"
        >
          HABLAR CON LA IA
        </button>

        {/* Botón para llamada de emergencia */}
        <button
          onClick={llamarEmergencia}
          className="w-full bg-red-600 text-white text-lg font-bold p-4 mt-6 rounded-lg"
        >
          LLAMAR A CONTACTO DE EMERGENCIA
        </button>

        {/* Botón para enviar mensaje de emergencia */}
        <button
          onClick={enviarMensajeWhatsApp}
          className="w-full bg-blue-700 text-white text-lg font-semibold p-4 mt-4 rounded-lg"
        >
          ENVIAR MENSAJE DE EMERGENCIA
        </button>
      </div>
    </div>
  );

}
