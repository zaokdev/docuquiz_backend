const express = require("express");
const dotenv = require("dotenv").config();
const multer = require("multer");
const colors = require("colors");
const pdf = require("pdf-parse");
const upload = multer({ storage: multer.memoryStorage() });
const OpenAI = require("openai");
const apiCall = require("./utils/apiCall.js");
const connectDB = require("./config/connectdb.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
connectDB();

//API KEY
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));

// Ruta para subir y leer el PDF (pondré esta en el server.js porque no pondré más rutas con read-pdf :p)
app.post("/api/read-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún PDF" });
    }

    const data = await pdf(req.file.buffer); // Extrae el texto
    const quiz = await apiCall(openai, data.text);
    console.log(quiz);
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: `Error al leer el PDF: ${error.message}` });
  }
});

app.use("/api/auth", require("./routes/auth.routes.js"));
app.use("/api/quiz", require("./routes/quiz.routes.js"));

app.listen(port, () =>
  console.log(`Servidor iniciado en el puerto ${port}`.yellow.bold)
);
