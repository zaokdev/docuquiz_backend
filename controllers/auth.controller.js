const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema.js");

const login = async (username, password) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) throw new Error("JWT_SECRET no configurado");

    const user = await User.findOne({ username: username });
    if (!user) return { message: "No se encontró" };

    const result = await bcrypt.compare(password, user.password);
    if (!result) return { message: "Contraseña incorrecta" };

    const token = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      jwtSecret
    );

    return {
      token: token,
      user: {
        id: user._id,
        username: user.username,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Error en el servidor" };
  }
};

const register = async (username, email, password) => {
  try {
    const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return {
      user: {
        id: newUser._id,
        username: newUser.username,
      },
    };
  } catch (e) {
    console.error("Registration error:", e);
    return {
      message:
        e.code === 11000
          ? "El usuario o email ya existe"
          : "Error en el servidor",
    };
  }
};

const verifyUser = (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.json({ isAuthenticated: false });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Devuelve los datos del usuario sin exponer el token
    res.json({
      isAuthenticated: true,
      decoded,
    });
  } catch (error) {
    res.json({ isAuthenticated: false });
  }
};

const logout = (req, res) => {
  try {
    // Limpiar la cookie que contiene el token
    res.clearCookie("access_token", {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
      domain: "docuquiz.onrender.com",
      path: "/",
    });
    console.log(req.cookies);
    return res.json({ success: true, message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al cerrar sesión" });
  }
};

module.exports = {
  login,
  register,
  verifyUser,
  logout,
};
