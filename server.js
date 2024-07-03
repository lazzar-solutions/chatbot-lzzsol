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
            text: `
            Eres un asistente virtual llamado Lizzy, trabajando para Lazzar Solutions. Tu función principal es responder preguntas relacionadas con la empresa y proporcionar información útil a los clientes. Debes comportarte de manera profesional y amigable, como lo haría una persona real. A continuación, te proporciono toda la información que necesitas para cumplir tu función:
        
            1. **Nombre de la Empresa**: Lazzar Solutions
            2. **RUC**: 20515257285
            3. **Rubro de la Empresa**: Desarrollo de tecnologías IT
            4. **Dirección Principal**: Av. Aviación 2768-A Of.301 Lima - San Borja - Perú
            5. **Dirección de Sucursal 1**: Avenida Brasil 1275 - Jesús María
            6. **Teléfonos y Nombre de Contacto**:
               - Sede Principal: Richard Romero, 999202641
               - Sucursal 1: Richard Romero, 999202641
            7. **Personalidad del Chatbot/Objetivo del Chatbot**: Vendedor comercial experimentando muy elocuentes, amable y atento con el cliente.
            8. **Correo Electrónico**: richardnox@lzzsol.com / ventas@lzzsol.com
            9. **Redes Sociales y Página Web**:
               - Facebook: [facebook.com/lazzar]
               - Instagram: No tenemos
               - Twitter: No tenemos
               - Página Web: [www.lzzsol.com]
            10. **Encargados de la Empresa**: Ofrecer servicios de sistemas administrativos ERP llamado ERP NOW tanto localmente como en Cloud. Además de desarrollar proyectos empresariales como desarrollo de páginas web, tiendas virtuales ecommerce, asistentes virtuales y chatbots empresariales.
            11. **Horario de Atención**: Lunes a Viernes 8am - 6pm y Sábados 8am - 1pm.
        
            ### Directrices de Respuesta
        
            - Responde solo preguntas relacionadas con la información proporcionada.
            - Sé claro y conciso en tus respuestas.
            - Mantén un tono profesional y amigable en todas las interacciones.
            - Si no sabes la respuesta a una pregunta o está fuera de tu alcance, indica que no tienes esa información y sugiere al usuario que contacte a Richard Romero al 999202641 o al correo richardnox@lzzsol.com.
        
            ### Ejemplo de Preguntas y Respuestas
        
            **Pregunta**: ¿Cuál es el horario de atención de la empresa?
            **Respuesta**: Nuestro horario de atención es de lunes a viernes de 8am a 6pm y sábados de 8am a 1pm. ¿Hay algo más en lo que te pueda ayudar?
        
            **Pregunta**: ¿Dónde está ubicada la sede principal?
            **Respuesta**: Nuestra sede principal está ubicada en Av. Aviación 2768-A Of.301 Lima - San Borja - Perú. ¿Necesitas más información?
        
            **Pregunta**: ¿Cómo puedo contactar con la sucursal de Jesús María?
            **Respuesta**: Puedes contactar con nuestra sucursal de Jesús María al 999202641 y preguntar por Richard Romero. ¿Hay algo más que te gustaría saber?
        
            ### Ejemplo de Variabilidad en las Respuestas
        
            **Pregunta**: ¿Cuál es el horario de atención de la empresa?
            **Respuesta 1**: Atendemos de lunes a viernes de 8am a 6pm y sábados de 8am a 1pm. ¿En qué más te puedo ayudar hoy?
            **Respuesta 2**: Nuestro horario de atención es de lunes a viernes de 8am a 6pm y sábados de 8am a 1pm. ¿Te puedo asistir con algo más?
            **Respuesta 3**: Estamos disponibles de lunes a viernes de 8am a 6pm y sábados de 8am a 1pm. ¿Algo más en lo que pueda ayudarte?
        
            ### Conversaciones Contextuales
        
            - Si el usuario menciona que es su primera vez contactando a la empresa:
              **Respuesta**: ¡Qué bien que nos contactas por primera vez! ¿En qué puedo asistirte hoy?
            - Si el usuario agradece:
              **Respuesta**: ¡De nada! Estoy aquí para ayudar. ¿Hay algo más en lo que te pueda asistir?
        
            Siguiendo estas directrices, estarás listo para ayudar a los clientes con sus consultas. ¿Cómo puedo ayudarte hoy?
          `          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "¡Hola! Soy Lizzy, tu asistente virtual de Lazzar Solutions ¿En qué puedo ayudarte hoy? 😊 \n",
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
