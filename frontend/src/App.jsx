import { useState } from 'react';
import GenerateQuiz from './components/GenerateQuiz';
import History from './components/History';

function App() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Wiki Quiz App</h1>
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'generate'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Generate Quiz
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                History
              </button>
            </nav>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generate' && <GenerateQuiz />}
        {activeTab === 'history' && <History />}
      </main>
    </div>
  );
}

export default App;

