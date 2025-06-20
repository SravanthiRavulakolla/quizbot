import React, { useState, useEffect } from 'react';
import { Home, BarChart3, Settings, User } from 'lucide-react';
import TopicSelection from './components/TopicSelection.jsx';
import VoiceQuiz from './components/VoiceQuiz.jsx';
import QuizResults from './components/QuizResults.jsx';
import Dashboard from './components/Dashboard.jsx';
import GameService from './services/gameService.js';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, quiz, results, dashboard
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [gameService] = useState(() => new GameService());

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setCurrentView('quiz');
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setCurrentView('results');
  };

  const handlePlayAgain = () => {
    setQuizResults(null);
    setCurrentView('quiz');
  };

  const handleBackToHome = () => {
    setSelectedTopic(null);
    setQuizResults(null);
    setCurrentView('home');
  };

  const handleViewDashboard = () => {
    setCurrentView('dashboard');
  };

  const NavigationBar = () => (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🎤</div>
            <h1 className="text-xl font-bold text-gray-800">Voice Quiz Bot</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToHome}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              onClick={handleViewDashboard}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <User size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Level {gameService.getUserData().level}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <TopicSelection
            onTopicSelect={handleTopicSelect}
            gameService={gameService}
          />
        );

      case 'quiz':
        return (
          <VoiceQuiz
            topic={selectedTopic}
            onQuizComplete={handleQuizComplete}
            gameService={gameService}
          />
        );

      case 'results':
        return (
          <QuizResults
            results={quizResults}
            topic={selectedTopic}
            onPlayAgain={handlePlayAgain}
            onBackToHome={handleBackToHome}
            gameService={gameService}
          />
        );

      case 'dashboard':
        return (
          <Dashboard gameService={gameService} />
        );

      default:
        return (
          <TopicSelection
            onTopicSelect={handleTopicSelect}
            gameService={gameService}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <main className="py-6">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">🎤 Voice Quiz Bot - Test your knowledge with voice commands!</p>
            <p className="text-sm">
              Speak your answers clearly or click to select.
              {gameService.getStats().quizzesCompleted > 0 && (
                <span className="ml-2 font-semibold">
                  You've completed {gameService.getStats().quizzesCompleted} quizzes!
                </span>
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
