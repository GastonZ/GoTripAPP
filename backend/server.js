const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const http = require("http");
const socketIo = require("socket.io");
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

io.on("connection", (socket) => {
    console.log("🟢 Nuevo usuario conectado:", socket.id);

    socket.on("ubicacion", (data) => {
        ubicacionActual = data;
        console.log("📍 Ubicación actualizada:", ubicacionActual);
    });

    socket.on("ubicacion_manual", (data) => {
        ubicacionActual = data;
        console.log("🛠️ Ubicación manual establecida:", ubicacionActual);
    });

    socket.on("mensaje", async (data) => {
        const { mensaje } = data;
        console.log(`📩 Mensaje recibido desde frontend: "${mensaje}"`);
        console.log(`📍 Ubicación del usuario: lat ${ubicacionActual?.latitud}, lon ${ubicacionActual?.longitud}`);

        try {
          const respuesta = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: `Guía turística para una persona no vidente:
                Necesito que actúes como un guía turístico real. Brinda detalles sobre la ubicación actual.
                Ubicación actual: Lat ${ubicacionActual.latitud}, Lon ${ubicacionActual.longitud}.
                Mensaje del usuario: "${mensaje}"
                Responde con un lenguaje natural y conversacional, sin enumerar pasos explícitos.
                Debes asegurarte de que la persona no vidente se sienta acompañada en todo momento y guiarla de forma fluida.` }],
            max_tokens: 250,
        });
        

            const textoRespuesta = respuesta.choices[0].message.content.trim();
            const tokensUsados = respuesta.usage.total_tokens;

            console.log("🔹 Respuesta de la IA:", textoRespuesta);
            console.log(`📊 Tokens usados: ${tokensUsados} | 💲 Costo estimado: ${tokensUsados * 0.002} USD`);

            socket.emit("respuesta", { respuesta: textoRespuesta, tokensUsados, costoEstimado: tokensUsados * 0.002 });

        } catch (error) {
            console.error("❌ Error con OpenAI:", error);
            socket.emit("respuesta", { respuesta: "Error al procesar la solicitud." });
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 Usuario desconectado:", socket.id);
    });
});

server.listen(port, () => {
    console.log(`✅ Servidor corriendo en puerto ${port}`);
});
