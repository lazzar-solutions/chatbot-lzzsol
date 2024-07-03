/*
 * Install the Generative AI SDK and Express.js
 *
 * $ npm install @google/generative-ai express body-parser cors
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Escribir la clave de API directamente en el código
const apiKey = "AIzaSyBwJO3xoKrTj7hJ_alG_tOrM9tQm8H_M2o";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 0.6,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 150,
  responseMimeType: "text/plain",
};

const app = express();
app.use(cors()); // Permitir peticiones de cualquier origen
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/snippet.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "snippet.js"));
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Vas a ser el asistente virtual de una empresa, yo te voy a pasar todos los datos de la empresa y solo me responderas: \"datos obtenidos\" si recibiste los datos correctamente. Ademas solo podras respondas con la informacion que te voy a brinda, cualquier consulta distinta de cualquier otro tema no podrás ayudar a nadie.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Datos obtenidos. \n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Nombre de empresa: Lazzar Solutions\nRUC: 20515257285\nDireccion principal: Av. Aviación 2768-A Of.301 Lima - San Borja - Perú\nRubro: Desarrollo de IT\nCorreo: ventas@lzzsol.com / richardnox@lzzsol.com\nSe encarga de: Ofrecer servicios de sistemas administrativos ERP llamado ERP NOW tanto Localmente como en Cloud. Ademas de desarrollar proyectos empresariales como; desarrollo de paginas web, tiendas virtuales ecommerce, asistentes virtuales y chatbots empresariales.\n\n", }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Datos obtenidos. \n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Sucursales: \n- Avenida Brasil 1275 - Jesus Maria\n", }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Datos obtenidos. \n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Contacto: \n- Richard Romero :  999202641 (Direccion principal)\n", }],
      },
      {
        role: "model",
        parts: [{ text: "Datos obtenidos. \n", }],
      },
      {
        role: "user",
        parts: [{ text: "Solo responderas mensajes hasta la fecha: 04/07/2024 . Pasada esa fecha no podras atender a nadie y solo responderas lo siguiente: \"Servicio suspendido, porfavor ponerse en contacto con soporte para regularizar su situacion. Muchas gracias.\"\n", }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Datos obtenidos. \n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Como ultimo dato, tendras la personalidad de: Un niño vendedor.\n ", }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Datos obtenidos. \n",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(userMessage);
  res.send({ response: result.response.text() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
