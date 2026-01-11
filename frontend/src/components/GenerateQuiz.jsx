import { useState } from 'react';
import { generateQuiz } from '../services/api';
import QuizDisplay from './QuizDisplay';
import TakeQuiz from './TakeQuiz';

function GenerateQuiz() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('display'); // 'display' or 'take'
  console.log(quizData);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a Wikipedia URL');
      return;
    }

    setLoading(true);
    setError('');
    setQuizData(null);

    try {
      const data = await generateQuiz(url);
      setQuizData(data);
      setViewMode('display');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Quiz from Wikipedia</h2>
        
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Wikipedia URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://en.wikipedia.org/wiki/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Scraping Wikipedia and generating quiz...</p>
        </div>
      )}

      {quizData && !loading && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">{quizData.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('display')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'display'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                View Results
              </button>
              <button
                onClick={() => setViewMode('take')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'take'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Take Quiz
              </button>
            </div>
          </div>

          {viewMode === 'display' ? (
            <QuizDisplay quizData={quizData} />
          ) : (
            <TakeQuiz quizData={quizData} />
          )}
        </div>
      )}
    </div>
  );
}

export default GenerateQuiz;

