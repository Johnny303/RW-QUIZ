import React, { useEffect, useState } from "react";

const SubmittedQuestion = ({ question, selectedAnswers }) => {
  const [points, setPoints] = useState(0);

  useEffect(() => {let correctSelectedAnswersCount = 0;
    let incorrectSelectedAnswersCount = 0;
    
    question.answers.forEach((answer, index) => {
        if (selectedAnswers[index]) {
            if (answer.isCorrect) {
                correctSelectedAnswersCount++;  // Count selected correct answers
            } else {
                incorrectSelectedAnswersCount++;  // Count selected incorrect answers
            }
        }
    });
    
    // Determine the score
    let score = 0;
    let message = '';
    
    if (incorrectSelectedAnswersCount > 0) {
        score = 0;
        setPoints(score);
        message = "The selected answers are incorrect. You get 0 points.";
    } else if (correctSelectedAnswersCount === question.correctAnswersCount) {
        score = 1;
        setPoints(score);

        message = "The selected answers are correct. You get 1 point.";
    } else if (correctSelectedAnswersCount > 0) {
        // Calculate partial points (correctly selected answers / total correct answers)
        score = correctSelectedAnswersCount / question.correctAnswersCount;
        setPoints(score);

        message = `You selected some correct answers, but not all. You get ${score} points.`;
    } else {
        score = 0
        setPoints(score);
        message = "No correct answers selected. You get 0 points.";
    }
    
    console.log(message);}, [question, selectedAnswers]);

  return (
    <div className="submitted-question">
      <h3>Submitted Question: {question.question}</h3>
      <ul>
        {question.answers.map((answer, index) => (
          <li
            key={index}
            style={{
              color: answer.isCorrect ? "green" : "red",
              fontWeight: selectedAnswers[index] ? "bold" : "normal",
            }}
          >
            {answer.text} {selectedAnswers[index] && "(Selected)"}
          </li>
        ))}
      </ul>
      <p>Points for this question: {points}</p>
    </div>
  );
};

export default SubmittedQuestion;
