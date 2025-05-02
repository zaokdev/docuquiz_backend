const multer = require("multer");

// Configura Multer para procesar el PDF en memoria (sin guardar en disco)
const storage = multer.memoryStorage();

// Filtro para aceptar solo PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB
});

module.exports = upload;
