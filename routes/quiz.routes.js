const express = require("express");
const router = express.Router();
const {
  getQuiz,
  addQuiz,
  deleteQuiz,
  editQuiz,
} = require("../controllers/quiz.controller.js");
const authenticateToken = require("../middleware/authMiddleware.js");

router.get("/:id", getQuiz);
router.post("/", authenticateToken, addQuiz);
router.delete("/:id", authenticateToken, deleteQuiz);
router.put("/:id", authenticateToken, editQuiz);

module.exports = router;
