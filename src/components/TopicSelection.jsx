import React from 'react';
import { Play, Trophy, Target, Clock } from 'lucide-react';
import { quizTopics } from '../data/quizData.js';

const TopicSelection = ({ onTopicSelect, gameService }) => {
  const stats = gameService.getStats();
  
  const getTopicStats = (topicKey) => {
    const topicStats = stats.topicStats[topicKey];
    if (!topicStats) {
      return {
        completed: 0,
        accuracy: 0,
        bestScore: 0
      };
    }
    
    return {
      completed: topicStats.quizzesCompleted,
      accuracy: Math.round((topicStats.totalCorrect / topicStats.totalQuestions) * 100) || 0,
      bestScore: topicStats.bestScore
    };
  };

  const TopicCard = ({ topicKey, topic }) => {
    const topicStats = getTopicStats(topicKey);
    const isNew = topicStats.completed === 0;
    
    return (
      <div 
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
        onClick={() => onTopicSelect(topicKey)}
      >
        <div 
          className="h-32 rounded-t-lg flex items-center justify-center text-6xl"
          style={{ backgroundColor: topic.color + '20' }}
        >
          {topic.icon}
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-800">{topic.name}</h3>
            {isNew && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                NEW
              </span>
            )}
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Target size={14} />
                Questions
              </span>
              <span className="font-semibold">{topic.questions.length}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Trophy size={14} />
                Completed
              </span>
              <span className="font-semibold">{topicStats.completed}</span>
            </div>
            
            {!isNew && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Target size={14} />
                    Accuracy
                  </span>
                  <span className={`font-semibold ${
                    topicStats.accuracy >= 80 ? 'text-green-600' :
                    topicStats.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {topicStats.accuracy}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Trophy size={14} />
                    Best Score
                  </span>
                  <span className="font-semibold text-blue-600">{topicStats.bestScore}%</span>
                </div>
              </>
            )}
          </div>
          
          <button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: topic.color }}
          >
            <Play size={18} />
            {isNew ? 'Start Quiz' : 'Play Again'}
          </button>
        </div>
      </div>
    );
  };

  const getDifficultyStats = () => {
    const difficulties = { easy: 0, medium: 0, hard: 0 };
    
    Object.values(quizTopics).forEach(topic => {
      topic.questions.forEach(question => {
        difficulties[question.difficulty]++;
      });
    });
    
    return difficulties;
  };

  const difficultyStats = getDifficultyStats();
  const totalQuestions = Object.values(difficultyStats).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Quiz Topic</h1>
        <p className="text-lg text-gray-600 mb-6">
          Test your knowledge with our voice-enabled quiz system
        </p>
        
        {/* Overall Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{Object.keys(quizTopics).length}</div>
              <div className="text-sm text-gray-600">Topics Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.quizzesCompleted}</div>
              <div className="text-sm text-gray-600">Quizzes Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((stats.totalCorrect / stats.totalQuestions) * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Difficulty Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{difficultyStats.easy}</div>
            <div className="text-sm text-gray-600">Easy Questions</div>
            <div className="text-xs text-gray-500">10 points each</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{difficultyStats.medium}</div>
            <div className="text-sm text-gray-600">Medium Questions</div>
            <div className="text-xs text-gray-500">20 points each</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{difficultyStats.hard}</div>
            <div className="text-sm text-gray-600">Hard Questions</div>
            <div className="text-xs text-gray-500">30 points each</div>
          </div>
        </div>
      </div>

      {/* Topic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.entries(quizTopics).map(([topicKey, topic]) => (
          <TopicCard key={topicKey} topicKey={topicKey} topic={topic} />
        ))}
      </div>

      {/* Voice Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
          🎤 Voice Quiz Instructions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">How to Answer:</h4>
            <ul className="space-y-1">
              <li>• Say "A", "B", "C", or "D" for your answer</li>
              <li>• You can also say "Option A", "First", etc.</li>
              <li>• Speak clearly after the question is read</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="space-y-1">
              <li>• Questions are read aloud automatically</li>
              <li>• Instant feedback on your answers</li>
              <li>• Manual clicking also available</li>
              <li>• Toggle voice on/off anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;
