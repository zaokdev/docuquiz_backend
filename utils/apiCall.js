async function apiCall(openai, PDFtext) {
  const staticQuizFormat = `
  {
    questions: [
      {
        question_id: 1,
        question: "EJEMPLO DE PREGUNTA CON UNA SOLA RESPUESTA",
        type: "unique",
        answers: [
          { id: 1, text: "Respuesta1" },
          { id: 2, text: "Respuesta2" },
          { id: 3, text: "Respuesta3" },
        ],
        correct_answers: 1,
        feedback: "EXPLICACIÓN DE LA RESPUESTA CORRECTA",
      },
      {
        question_id: 2,
        question: "EJEMPLO DE PREGUNTA CON VARIAS RESPUESTAS",
        type: "multiple",
        answers: [
          { id: 1, text: "Respuesta1" },
          { id: 2, text: "Respuesta2" },
          { id: 3, text: "Respuesta3" },
        ],
        correct_answers: [1, 3],
        feedback: "FEEDBACK DE LAS RESPUESTAS CORRECTAS",
      },
      {
        question_id: 3,
        question: "EJEMPLO DE PREGUNTA VERDADERO FALSO",
        type: "true_false",
        correct_answers: true,
        feedback: "FEEDBACK DE LA RESPUESTA CORRECTA",
      },
      {
        question_id: 4,
        question: "EJEMPLO DE PREGUNTA ABIERTA",
        type: "free",
        correct_answers: null,
        feedback: "FEEDBACK DE LA RESPUESTA CORRECTA",
      },
    ],
  };
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
        Genera un cuestionario en formato JSON estricto basado en el siguiente texto:  
        "${PDFtext}"

        Requisitos:  
        1. **Formato**:  
          - Usa EXACTAMENTE este esquema (no lo modifiques):
          ${staticQuizFormat}

        2. **Cantidad y tipos**:  
          - 30 preguntas mínimo.  
          - 15 "unique", 5 "multiple", 8 "true_false", 2 "free".
          - Que sean en diferente orden, no seguidas de todo un tipo. 

        3. Las preguntas deben ser relevantes al texto proporcionado.
        4. Solo responde con el JSON, sin comentarios adicionales.
      `,
      },
    ],

    model: "deepseek-chat",
    response_format: { type: "json_object" },
    max_tokens: 4000,
    temperature: 0.3,
  });

  return completion.choices[0].message.content;
}

module.exports = apiCall;
