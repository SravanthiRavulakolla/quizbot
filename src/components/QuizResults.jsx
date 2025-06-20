import React, { useEffect, useState } from 'react';
import { Trophy, Star, Zap, Target, RotateCcw, Home, TrendingUp } from 'lucide-react';
import { quizTopics } from '../data/quizData.js';

const QuizResults = ({ results, topic, onPlayAgain, onBackToHome, gameService }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  
  const { score, xpGained, newLevel, newAchievements } = results;
  const topicData = quizTopics[topic];
  const userData = gameService.getUserData();
  
  useEffect(() => {
    // Trigger celebration animation for good scores
    if (score.percentage >= 80) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    
    // Animate score counting
    const duration = 2000;
    const steps = 60;
    const increment = score.percentage / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score.percentage) {
        setAnimatedScore(score.percentage);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [score.percentage]);

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage) => {
    if (percentage === 100) return "Perfect! Outstanding work! 🎉";
    if (percentage >= 90) return "Excellent! You're a quiz master! 🌟";
    if (percentage >= 80) return "Great job! Well done! 👏";
    if (percentage >= 70) return "Good work! Keep it up! 👍";
    if (percentage >= 60) return "Not bad! Room for improvement! 📚";
    return "Keep practicing! You'll get better! 💪";
  };

  const ScoreCircle = ({ percentage, size = 200 }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={percentage >= 80 ? "#10B981" : percentage >= 60 ? "#F59E0B" : "#EF4444"}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
              {animatedScore}%
            </div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
        </div>
      </div>
    );
  };

  const AchievementNotification = ({ achievement }) => (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg animate-bounce">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{achievement.icon}</div>
        <div>
          <div className="font-bold">Achievement Unlocked!</div>
          <div className="text-sm">{achievement.name}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-ping">🎉</div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{topicData.icon}</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {topicData.name} Quiz Complete!
        </h1>
        <p className="text-lg text-gray-600">{getScoreMessage(score.percentage)}</p>
      </div>

      {/* Main Results */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Score Circle */}
          <div className="flex justify-center">
            <ScoreCircle percentage={score.percentage} />
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{score.correctCount}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {score.totalQuestions - score.correctCount}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{score.totalPoints}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">+{xpGained}</div>
                <div className="text-sm text-gray-600">XP Gained</div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Level {userData.level}</span>
                {newLevel > userData.level - xpGained && (
                  <span className="text-sm font-bold text-green-600 animate-pulse">
                    LEVEL UP! 🎉
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${gameService.getCurrentLevelProgress().percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Achievements */}
      {newAchievements.length > 0 && (
        <div className="mb-6 space-y-3">
          {newAchievements.map((achievement) => (
            <AchievementNotification key={achievement.id} achievement={achievement} />
          ))}
        </div>
      )}

      {/* Detailed Results */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target size={20} />
          Question Breakdown
        </h3>
        <div className="space-y-3">
          {score.results.map((result, index) => {
            const question = topicData.questions[index];
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.isCorrect 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      Question {index + 1}: {question.question}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Your answer: {question.options[result.isCorrect ? question.correctAnswer : -1] || 'No answer'}
                      {!result.isCorrect && (
                        <span className="ml-2 text-green-600">
                          (Correct: {question.options[question.correctAnswer]})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isCorrect ? `+${result.points}` : '0'} pts
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.timeSpent.toFixed(1)}s
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onPlayAgain}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
        >
          <RotateCcw size={20} />
          Play Again
        </button>
        <button
          onClick={onBackToHome}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          <Home size={20} />
          Back to Topics
        </button>
      </div>

      {/* Motivational Message */}
      <div className="mt-8 text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="text-lg font-semibold text-gray-800 mb-2">
          {score.percentage >= 80 ? "Keep up the excellent work!" : "Practice makes perfect!"}
        </div>
        <div className="text-gray-600">
          {score.percentage >= 80 
            ? "You're mastering this topic. Try another one to expand your knowledge!"
            : "Review the questions you missed and try again to improve your score!"
          }
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
