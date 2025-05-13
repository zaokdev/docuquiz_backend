const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyUser,
  logout,
} = require("../controllers/auth.controller.js");

const authenticateToken = require("../middleware/authMiddleware.js");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Se requiere usuario y contraseña" });

  const result = await login(username, password);

  if (result.error) return res.status(400).json(result);

  res
    .cookie("access_token", result.token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: none,
      domain: "docuquiz.onrender.com",
      path: "/",
    })
    .status(200)
    .json(result);
});

router.post("/register", async (req, res) => {
  if (
    !req.body ||
    !req.body.username ||
    !req.body.password ||
    !req.body.email
  ) {
    return res.status(400).json({ message: "Datos invalidos" });
  }
  const { username, email, password } = req.body;
  const response = await register(username, email, password);
  res.json({ response });
});

router.post("/verify", verifyUser);

router.post("/logout", logout);

module.exports = router;
