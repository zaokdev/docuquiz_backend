const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyUser,
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

  router.post("/login", authenticateToken, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Se requiere usuario y contraseña" });

    try {
      const result = await login(username, password);
      if (result.error) return res.status(400).json(result);

      res
        .cookie("access_token", result.token, {
          httpOnly: true,
          maxAge: 100 * 60 * 60,
        })
        .status(200)
        .json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error de servidor" });
    }
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
    try {
      const { username, email, password } = req.body;
      const response = await register(username, email, password);
      res.json({ response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error de servidor" });
    }
  });

  router.post("/verify", authenticateToken, verifyUser);
  res
    .cookie("access_token", result.token, {
      httpOnly: true,
      maxAge: 100 * 60 * 60,
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

module.exports = router;
