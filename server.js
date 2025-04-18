const express = require("express");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`));
