const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  if (!req.cookies.access_token || !req.cookies) {
    return res
      .status(401)
      .json({ message: "No autorizado - Token no proporcionado" });
  }
  const token = req.cookies.access_token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); //
  } catch (error) {
    console.error("Error al verificar token:", error);
    return res.status(403).json({ message: "No autorizado - Token inválido" });
  }
};

module.exports = authenticateToken;
