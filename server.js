/*
 * Install the Generative AI SDK and Express.js
 *
 * $ npm install @google/generative-ai express body-parser cors mysql dotenv
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Escribir la clave de API directamente en el código
const apiKey = "AIzaSyBwJO3xoKrTj7hJ_alG_tOrM9tQm8H_M2o";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const generationConfig = {
  temperature: 1.5,
  topP: 0.95,
  topK: 80,
  maxOutputTokens: 200,
  responseMimeType: "text/plain",
};

const app = express();
app.use(cors()); // Permitir peticiones de cualquier origen
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Conectado a la base de datos MySQL");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/snippet.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "snippet.js"));
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // Variable id_usuario
  const id_usuario = 1;

  // Consulta a la base de datos
  db.query(
    "SELECT * FROM clientes_prompt WHERE id_user = ?",
    [id_usuario],
    (err, result) => {
      if (err) {
        console.error("Error al realizar la consulta:", err);
        return res.status(500).send("Error en el servidor");
      }

      if (result.length === 0) {
        return res
          .status(404)
          .send("No se encontraron datos para el usuario especificado");
      }

      // Obtener los campos bot_prompt y model_response
      const { bot_prompt, model_response } = result[0];
      console.log("bot_prompt:", bot_prompt);
      console.log("model_response:", model_response);

      // Continuar con el flujo normal del chat
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {
                text: bot_prompt,
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: model_response,
              },
            ],
          },
        ],
      });

      chatSession
        .sendMessage(userMessage)
        .then((result) => {
          res.send({ response: result.response.text() });
        })
        .catch((err) => {
          console.error("Error al enviar el mensaje:", err);
          res.status(500).send("Error en el servidor");
        });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
