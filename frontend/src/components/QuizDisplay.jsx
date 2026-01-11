function QuizDisplay({ quizData }) {
  const { data, title } = quizData;
  
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      {data.summary && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Summary</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.summary}</p>
        </div>
      )}

      {/* Key Entities Card */}
      {data.key_entities && data.key_entities.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Key Entities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.key_entities.map((entity, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{entity.name}</span>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {entity.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{entity.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Questions */}
      {data.quiz_questions && data.quiz_questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Quiz Questions</h3>
          {data.quiz_questions.map((question, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Question {index + 1}
                </h4>
                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                  question.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-green-100 text-green-700'
                }`}>
                  {question.difficulty || 'medium'}
                </span>
              </div>
              <p className="text-gray-800 mb-4">{question.question}</p>
              
              <div className="space-y-2 mb-4">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-3 rounded-lg border-2 ${
                      option.is_correct
                        ? 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">{option.text}</span>
                      {option.is_correct && (
                        <span className="ml-auto px-2 py-1 text-xs font-medium bg-green-500 text-white rounded">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {question.explanation && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                  <p className="text-blue-800">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* ADDED: Related Topics Card */}
      {data.related_topics && data.related_topics.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Further Reading</h3>
          <div className="flex flex-wrap gap-2">
            {data.related_topics.map((topic, idx) => (
              <a
                key={idx}
                href={`https://en.wikipedia.org/wiki/${topic.replace(/ /g, '_')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
              >
                {topic}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizDisplay;

