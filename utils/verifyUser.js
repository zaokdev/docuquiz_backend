const verifyUserIsTheSame = (userId, quizCreatorId) => {
  try {
    console.log(userId, quizCreatorId);
    return userId == quizCreatorId ? true : false;
  } catch (error) {
    console.error("Error al verificar token:", error);
    return;
  }
};

module.exports = verifyUserIsTheSame;
