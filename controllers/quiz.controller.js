const Quiz = require("../models/staticQuizSchema");
const verifyUserIsTheSame = require("../utils/verifyUser");

async function getQuiz(req, res) {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.status(200).json({ quiz });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function addQuiz(req, res) {
  console.log(req.body);
  console.log(req.user);
  if (
    !req.body ||
    !req.body.quizTitle ||
    !req.body.questions ||
    !req.body.quizCreatorId
  ) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const quiz = await Quiz.create({
    quizTitle: req.body.quizTitle,
    questions: req.body.questions,
    quizCreatorId: req.body.quizCreatorId,
  });

  res.status(201).json({ quiz });
}

async function deleteQuiz(req, res) {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz no encontrado");
  }

  const { id } = req.user;
  const isTheSameUser = verifyUserIsTheSame(id, quiz.quizCreatorId);

  if (!isTheSameUser) {
    return res
      .status(401)
      .json({ message: "No eres el autor de este quiz, no puedes eliminarlo" });
  }

  await quiz.deleteOne();
  res.status(200).json({ id: req.params.id });
}

async function editQuiz(req, res) {
  if (!req.body.quizTitle || !req.body.questions || !req.body.quizCreatorId) {
    return res.status(400);
  }
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(400);
    throw new Error("Quiz no encontrado");
  }

  const { id } = req.user;
  const isTheSameUser = verifyUserIsTheSame(id, quiz.quizCreatorId);

  if (!isTheSame) {
    return res.status(401).json({
      message: "No eres el autor de este quiz, no puedes modificarlo",
    });
  }

  const quizUpdate = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({ quizUpdate });
}

module.exports = {
  getQuiz,
  addQuiz,
  deleteQuiz,
  editQuiz,
};
