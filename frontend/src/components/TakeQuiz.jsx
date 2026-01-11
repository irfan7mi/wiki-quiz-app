import { useState } from 'react';

function TakeQuiz({ quizData }) {
  const { data } = quizData;
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmit = () => {
    if (!data.quiz_questions) return;
    
    let correctCount = 0;
    data.quiz_questions.forEach((question, qIndex) => {
      const selectedOptionIndex = answers[qIndex];
      if (selectedOptionIndex !== undefined) {
        const selectedOption = question.options[selectedOptionIndex];
        if (selectedOption && selectedOption.is_correct) {
          correctCount++;
        }
      }
    });

    setScore(correctCount);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  if (!data.quiz_questions || data.quiz_questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
        No quiz questions available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Take the Quiz</h3>
          {submitted && score !== null && (
            <div className="text-lg font-semibold">
              Score: {score} / {data.quiz_questions.length}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {data.quiz_questions.map((question, qIndex) => {
            const selectedOptionIndex = answers[qIndex];
            const selectedOption = selectedOptionIndex !== undefined 
              ? question.options[selectedOptionIndex] 
              : null;

            return (
              <div key={qIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Question {qIndex + 1}: {question.question}
                </h4>
                
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => {
                    const isSelected = selectedOptionIndex === optIndex;
                    const isCorrect = option.is_correct;
                    const showResult = submitted && isCorrect;
                    const showWrong = submitted && isSelected && !isCorrect;

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswerSelect(qIndex, optIndex)}
                        disabled={submitted}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? submitted
                              ? isCorrect
                                ? 'bg-green-50 border-green-500'
                                : 'bg-red-50 border-red-500'
                              : 'bg-blue-50 border-blue-500'
                            : submitted && isCorrect
                            ? 'bg-green-50 border-green-300'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800">{option.text}</span>
                          {showResult && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded">
                              Correct
                            </span>
                          )}
                          {showWrong && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded">
                              Wrong
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {submitted && question.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                    <p className="text-blue-800">{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < data.quiz_questions.length}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Reset Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;

