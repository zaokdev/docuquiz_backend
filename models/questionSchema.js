const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema para las respuestas
const answerSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      min: 1,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
); // Deshabilitar _id para subdocumentos

// Schema principal para las preguntas
const questionSchema = new Schema(
  {
    question_id: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    type: {
      type: String,
      required: true,
      enum: ["unique", "multiple", "true_false", "free"],
      lowercase: true,
    },

    answers: {
      type: [answerSchema],
      required: function () {
        return this.type !== "true_false" && this.type !== "free";
      },
      validate: {
        validator: function (arr) {
          if (this.type === "unique" || this.type === "multiple") {
            return arr && arr.length >= 2;
          }
          return true;
        },
        message: "Debe haber al menos 2 respuestas para preguntas con varias",
      },
    },
    correct_answers: {
      type: Schema.Types.Mixed,
      required: function () {
        return this.type !== "free";
      },
      validate: {
        validator: function (value) {
          switch (this.type) {
            case "unique":
              return Number.isInteger(value) && value >= 1;
            case "multiple":
              return (
                Array.isArray(value) &&
                value.length >= 1 &&
                value.every(Number.isInteger)
              );
            case "true_false":
              return typeof value === "boolean";
            default:
              return true;
          }
        },
        message: "Formato incorrecto para las respuestas correctas",
      },
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    toJSON: { virtuals: true },
  }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
