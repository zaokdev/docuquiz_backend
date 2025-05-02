const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller.js");
const authenticateToken = require("../middleware/authMiddleware.js");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Se requiere usuario y contraseña" });

  const result = await login(username, password);

  if (!result.token) return res.json(result);
  res
    .cookie("access_token", result.token, {
      httpOnly: true,
      maxAge: 100 * 60 * 60,
    })
    .json(result.token);
});

router.post("/register", async (req, res) => {
  if (
    !req.body ||
    !req.body.username ||
    !req.body.password ||
    !req.body.email
  ) {
    return res.status(400).json({ message: "Invalid Data" });
  }
  const { username, email, password } = req.body;
  const response = await register(username, email, password);
  res.json({ response });
});

module.exports = router;
