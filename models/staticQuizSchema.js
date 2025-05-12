const mongoose = require("mongoose");
const { Schema } = mongoose;
const Question = require("./questionSchema.js");

const quizSchema = new Schema(
  {
    quizTitle: {
      type: String,
      required: true,
      maxlength: 100,
    },
    questions: [Question.schema],
    quizCreatorName: {
      type: String,
      required: true,
    },
    quizCreatorId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
