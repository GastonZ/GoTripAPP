const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const port = 3001;
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let ubicacionActual = null;
let destinoFinal = null;
let rutaGenerada = null;

// 1️⃣ Función para detectar el destino en el mensaje del usuario
const detectarDestino = async (mensaje) => {
    try {
        const respuestaDestino = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{
                role: "user",
                content: `Extrae únicamente el nombre del destino turístico mencionado en este mensaje sin agregar ningún otro texto. Si no hay un destino claro, responde "NO_DESTINO".
                Mensaje del usuario: "${mensaje}"`
            }],
            max_tokens: 30,
        });

        const posibleDestino = respuestaDestino.choices[0].message.content.trim();
        return posibleDestino === "NO_DESTINO" ? null : posibleDestino;
    } catch (error) {
        console.error("❌ Error detectando destino:", error);
        return null;
    }
};

// 2️⃣ Función para obtener coordenadas del destino
const obtenerCoordenadasDestino = async (nombreDestino) => {
    if (!nombreDestino) return null;

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(nombreDestino)},San+Miguel+de+Tucuman&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log("📡 Respuesta de Google Maps:", JSON.stringify(response.data, null, 2));

        if (response.data.status === "OK" && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return { latitud: location.lat, longitud: location.lng };
        } else {
            console.error("❌ No se encontraron resultados.");
            return null;
        }
    } catch (error) {
        console.error("❌ Error obteniendo coordenadas del destino:", error);
        return null;
    }
};

// 3️⃣ Función para generar una ruta a pie
const obtenerRuta = async (ubicacionActual, destinoFinal) => {
    if (!ubicacionActual || !destinoFinal) return ["No se pudo obtener la ruta."];

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${ubicacionActual.latitud},${ubicacionActual.longitud}&destination=${destinoFinal.latitud},${destinoFinal.longitud}&mode=walking&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.routes.length > 0) {
            return response.data.routes[0].legs[0].steps.map(step => step.html_instructions.replace(/<[^>]*>?/gm, ''));
        }
    } catch (error) {
        console.error("❌ Error obteniendo ruta:", error);
    }
    return ["No se pudo obtener la ruta."];
};

io.on("connection", (socket) => {
    console.log("🟢 Nuevo usuario conectado:", socket.id);

    socket.on("mensaje", async (data) => {
        const { mensaje } = data;
        console.log(`📩 Mensaje recibido desde frontend: "${mensaje}"`);
        console.log(`📍 Ubicación del usuario: lat ${ubicacionActual?.latitud}, lon ${ubicacionActual?.longitud}`);

        if (!destinoFinal) {
            const posibleDestino = await detectarDestino(mensaje);
            if (!posibleDestino) {
                socket.emit("respuesta", { respuesta: "No pude detectar el destino. ¿Podrías repetirlo?" });
                return;
            }

            console.log("📍 Destino detectado:", posibleDestino);
            const coordenadasDestino = await obtenerCoordenadasDestino(posibleDestino);
            if (!coordenadasDestino) {
                socket.emit("respuesta", { respuesta: "No se pudo encontrar la ubicación exacta del destino." });
                return;
            }

            destinoFinal = {
                nombre: posibleDestino,
                latitud: coordenadasDestino.latitud,
                longitud: coordenadasDestino.longitud
            };
            console.log("📌 Coordenadas del destino:", destinoFinal);
            socket.emit("respuesta", { respuesta: `Destino detectado: ${destinoFinal.nombre}. Generando ruta...` });

            // 4️⃣ Generar la ruta
            rutaGenerada = await obtenerRuta(ubicacionActual, destinoFinal);
            console.log("🛤️ Ruta generada:", rutaGenerada);

            if (rutaGenerada.length > 0) {
                // 5️⃣ Enviar la ruta a la IA para que la explique
                const explicacionIA = await openai.chat.completions.create({
                    model: "gpt-4-turbo",
                    messages: [{
                        role: "user",
                        content: `Guía turística accesible:
                        Actúa como un guía turístico especializado en personas no videntes en San Miguel de Tucumán.
                        Explica claramente los pasos de esta ruta para que una persona no vidente pueda seguirlos sin problemas.
                        
                        Ruta a seguir:
                        ${rutaGenerada.join(", ")}
                
                        Proporciona instrucciones detalladas sin usar símbolos especiales como ###, *, -, ni formateo innecesario.  
                        Usa lenguaje claro y directo, con descripciones auditivas y táctiles para ayudar a la persona a seguir la ruta de forma segura.`
                    }],
                    max_tokens: 1000,
                });

                const textoExplicacion = explicacionIA.choices[0].message.content.trim();
                socket.emit("respuesta", { respuesta: textoExplicacion });

                console.log("🗣️ Explicación de la IA enviada.");
            }
        }
    });

    socket.on("ubicacion", async (data) => {
        ubicacionActual = data;
        console.log("📍 Ubicación actualizada:", ubicacionActual);
        
        if (!rutaGenerada) {
            console.log("⏳ Esperando que el usuario indique un destino...");
            return;
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 Usuario desconectado:", socket.id);
    });
});

server.listen(port, () => {
    console.log(`✅ Servidor corriendo en puerto ${port}`);
});
