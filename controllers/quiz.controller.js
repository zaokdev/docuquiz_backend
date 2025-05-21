const Quiz = require("../models/staticQuizSchema");
const tienenLosMismosElementos = require("../utils/tienenLasMismasRespuestas");
const verifyUserIsTheSame = require("../utils/verifyUser");

async function getQuiz(req, res) {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select("-questions.correct_answers")
      .lean();
    res.status(200).json({ quiz });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function getUsersQuiz(req, res) {
  try {
    console.log(req.user);
    const quiz = await Quiz.find(
      {
        quizCreatorId: req.user.id,
      },
      { questions: 0 }
    );
    res.status(200).json({ quiz });
  } catch (e) {
    console.error(e);
  }
}

async function addQuiz(req, res) {
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
    quizCreatorName: req.body.quizCreatorName,
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

  if (!isTheSameUser) {
    return res.status(401).json({
      message: "No eres el autor de este quiz, no puedes modificarlo",
    });
  }

  const quizUpdate = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({ quizUpdate });
}

async function gradeLocalQuiz(req, res) {
  const { selectedAnswers, questions } = req.body;
  const totalQuestions = questions.length;
  let answerScoreSheet = [];
  let correctSelectedAnswers = 0;
  console.log(`Preguntas totales: ${totalQuestions}`);
  selectedAnswers.forEach((answer) => {
    const { correct_answers, type } = questions[answer.number - 1];
    switch (type) {
      case "unique":
        if (correct_answers == answer.answer) {
          answerScoreSheet.push({ number: answer.number, correct: true });
          correctSelectedAnswers++;
        } else {
          answerScoreSheet.push({ number: answer.number, correct: false });
        }
        break;

      //TODO
      case "multiple":
        if (tienenLosMismosElementos(answer.answer, correct_answers)) {
          answerScoreSheet.push({ number: answer.number, correct: true });
          correctSelectedAnswers++;
        } else {
          answerScoreSheet.push({ number: answer.number, correct: false });
        }
        break;

      case "true_false":
        if (correct_answers.toString() == answer.answer) {
          answerScoreSheet.push({ number: answer.number, correct: true });
          correctSelectedAnswers++;
        } else {
          answerScoreSheet.push({ number: answer.number, correct: false });
        }
        break;

      case "free":
        correctSelectedAnswers++;
        break;
    }
  });

  console.log(`Respuestas correctas: ${correctSelectedAnswers}`);
  console.log(answerScoreSheet);
  res.status(200).json(answerScoreSheet);
}

async function gradeOnlineQuiz(req, res) {
  const { id, selectedAnswers } = req.body;
  const quiz = await Quiz.findById(id);
  let answerScoreSheet = [];
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }
  console.log(quiz);
  quiz.questions.forEach((question) => {
    const { correct_answers, question_id, type } = question;
    const userAnswerObj = selectedAnswers.find(
      (answer) => answer.number === question_id
    );
    const { answer } = userAnswerObj;

    switch (type) {
      case "unique":
        if (correct_answers == answer) {
          answerScoreSheet.push({ number: question_id, correct: true });
        } else {
          answerScoreSheet.push({ number: question_id, correct: false });
        }

        break;

      case "multiple":
        if (tienenLosMismosElementos(correct_answers, answer)) {
          answerScoreSheet.push({ number: question_id, correct: true });
        } else {
          answerScoreSheet.push({ number: question_id, correct: false });
        }

        break;

      case "true_false":
        if (correct_answers.toString() == answer.toString()) {
          answerScoreSheet.push({ number: question_id, correct: true });
        } else {
          answerScoreSheet.push({ number: question_id, correct: false });
        }

        break;

      case "free":
        break;
    }
  });

  res.status(200).json(answerScoreSheet);
}

module.exports = {
  getQuiz,
  addQuiz,
  deleteQuiz,
  editQuiz,
  getUsersQuiz,
  gradeOnlineQuiz,
  gradeLocalQuiz,
};
