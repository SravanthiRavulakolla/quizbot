import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, Zap, Star, TrendingUp, Award } from 'lucide-react';

const Dashboard = ({ gameService }) => {
  const userData = gameService.getUserData();
  const stats = gameService.getStats();
  const achievements = gameService.getAchievements();
  const levelProgress = gameService.getCurrentLevelProgress();

  // Prepare chart data
  const topicData = Object.entries(stats.topicStats || {}).map(([topic, data]) => ({
    topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    accuracy: Math.round((data.totalCorrect / data.totalQuestions) * 100) || 0,
    quizzes: data.quizzesCompleted,
    bestScore: data.bestScore
  }));

  const recentScoresData = stats.recentScores.slice(0, 5).reverse().map((score, index) => ({
    quiz: `Quiz ${index + 1}`,
    score: score.score,
    points: score.points
  }));

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <Icon className={`h-8 w-8 text-${color}-500`} />
      </div>
    </div>
  );

  const AchievementBadge = ({ achievement }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
      <div className="text-3xl mb-2">{achievement.icon}</div>
      <h4 className="font-semibold text-gray-800 text-sm">{achievement.name}</h4>
      <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
      {achievement.unlockedAt && (
        <p className="text-xs text-green-600 mt-2">
          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userData.name}! {userData.avatar}</h1>
            <p className="text-blue-100 mt-2">Level {userData.level} • {userData.totalXP} XP</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100 mb-1">Progress to Level {userData.level + 1}</div>
            <div className="w-48 bg-blue-500 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-300"
                style={{ width: `${levelProgress.percentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-blue-100 mt-1">
              {levelProgress.current} / {levelProgress.total} XP
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Trophy}
          title="Quizzes Completed"
          value={stats.quizzesCompleted}
          subtitle={`${stats.totalQuestions} questions answered`}
        />
        <StatCard
          icon={Target}
          title="Accuracy"
          value={`${Math.round((stats.totalCorrect / stats.totalQuestions) * 100) || 0}%`}
          subtitle={`${stats.totalCorrect} correct answers`}
          color="green"
        />
        <StatCard
          icon={Zap}
          title="Current Streak"
          value={stats.currentStreak}
          subtitle={`Best: ${stats.maxStreak}`}
          color="yellow"
        />
        <StatCard
          icon={Star}
          title="Total Points"
          value={stats.totalPoints.toLocaleString()}
          subtitle={`${stats.perfectScores} perfect scores`}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Topic Performance
          </h3>
          {topicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#3B82F6" name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              <p>Complete some quizzes to see your performance!</p>
            </div>
          )}
        </div>

        {/* Recent Scores */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target size={20} />
            Recent Scores
          </h3>
          {recentScoresData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentScoresData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#10B981" name="Score %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              <p>No recent scores to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Topic Distribution */}
      {topicData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Distribution by Topic</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ topic, quizzes }) => `${topic}: ${quizzes}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quizzes"
                >
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {topicData.map((topic, index) => (
                <div key={topic.topic} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="font-medium">{topic.topic}</span>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-semibold">{topic.bestScore}% best</div>
                    <div className="text-gray-600">{topic.quizzes} quizzes</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Award size={20} />
          Achievements ({achievements.length})
        </h3>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No achievements yet. Complete some quizzes to start earning badges!</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{Object.keys(stats.topicStats || {}).length}</div>
            <div className="text-sm text-gray-600">Topics Explored</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.perfectScores}</div>
            <div className="text-sm text-gray-600">Perfect Scores</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{stats.maxStreak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{userData.level}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
