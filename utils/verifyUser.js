const verifyUserIsTheSame = (userId, quizCreatorId) => {
  try {
    return userId == quizCreatorId ? true : false;
  } catch (error) {
    console.error("Error al verificar token:", error);
    return;
  }
};

module.exports = verifyUserIsTheSame;
