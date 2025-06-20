import { achievements, difficultyMultipliers } from '../data/quizData.js';

class GameService {
  constructor() {
    this.storageKey = 'quiz-voice-bot-data';
    this.data = this.loadData();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
    
    return this.getDefaultData();
  }

  getDefaultData() {
    return {
      user: {
        name: 'Player',
        level: 1,
        totalXP: 0,
        avatar: '🎮'
      },
      stats: {
        quizzesCompleted: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        totalPoints: 0,
        currentStreak: 0,
        maxStreak: 0,
        perfectScores: 0,
        topicStats: {},
        recentScores: []
      },
      achievements: [],
      settings: {
        voiceEnabled: true,
        autoSpeak: true,
        speechRate: 1,
        theme: 'light'
      }
    };
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  getUserData() {
    return { ...this.data.user };
  }

  getStats() {
    return { ...this.data.stats };
  }

  getAchievements() {
    return [...this.data.achievements];
  }

  getSettings() {
    return { ...this.data.settings };
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveData();
  }

  calculateScore(questions, answers, timeSpent) {
    let totalPoints = 0;
    let correctCount = 0;
    const results = [];

    questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      let points = 0;

      if (isCorrect) {
        correctCount++;
        points = question.points * difficultyMultipliers[question.difficulty];
        
        // Time bonus (faster answers get more points)
        const timeBonus = Math.max(0, Math.floor((30 - (timeSpent[index] || 30)) / 5));
        points += timeBonus;
      }

      totalPoints += points;
      results.push({
        questionId: question.id,
        isCorrect,
        points,
        timeSpent: timeSpent[index] || 0
      });
    });

    return {
      totalPoints,
      correctCount,
      totalQuestions: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100),
      results
    };
  }

  submitQuizResults(topic, questions, answers, timeSpent) {
    const score = this.calculateScore(questions, answers, timeSpent);
    
    // Update stats
    this.data.stats.quizzesCompleted++;
    this.data.stats.totalQuestions += score.totalQuestions;
    this.data.stats.totalCorrect += score.correctCount;
    this.data.stats.totalPoints += score.totalPoints;

    // Update streak
    if (score.correctCount === score.totalQuestions) {
      this.data.stats.currentStreak += score.totalQuestions;
      this.data.stats.maxStreak = Math.max(this.data.stats.maxStreak, this.data.stats.currentStreak);
      if (score.percentage === 100) {
        this.data.stats.perfectScores++;
      }
    } else {
      this.data.stats.currentStreak = 0;
    }

    // Update topic stats
    if (!this.data.stats.topicStats[topic]) {
      this.data.stats.topicStats[topic] = {
        quizzesCompleted: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        bestScore: 0
      };
    }

    const topicStats = this.data.stats.topicStats[topic];
    topicStats.quizzesCompleted++;
    topicStats.totalCorrect += score.correctCount;
    topicStats.totalQuestions += score.totalQuestions;
    topicStats.bestScore = Math.max(topicStats.bestScore, score.percentage);

    // Add to recent scores
    this.data.stats.recentScores.unshift({
      topic,
      score: score.percentage,
      points: score.totalPoints,
      date: new Date().toISOString()
    });

    // Keep only last 10 scores
    this.data.stats.recentScores = this.data.stats.recentScores.slice(0, 10);

    // Update XP and level
    const xpGained = score.totalPoints;
    this.data.user.totalXP += xpGained;
    this.updateLevel();

    // Check for new achievements
    const newAchievements = this.checkAchievements();

    this.saveData();

    return {
      score,
      xpGained,
      newLevel: this.data.user.level,
      newAchievements
    };
  }

  updateLevel() {
    const xpForNextLevel = this.getXPForLevel(this.data.user.level + 1);
    if (this.data.user.totalXP >= xpForNextLevel) {
      this.data.user.level++;
      this.updateLevel(); // Check for multiple level ups
    }
  }

  getXPForLevel(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  getCurrentLevelProgress() {
    const currentLevelXP = this.getXPForLevel(this.data.user.level);
    const nextLevelXP = this.getXPForLevel(this.data.user.level + 1);
    const progress = this.data.user.totalXP - currentLevelXP;
    const total = nextLevelXP - currentLevelXP;
    
    return {
      current: progress,
      total,
      percentage: Math.round((progress / total) * 100)
    };
  }

  checkAchievements() {
    const newAchievements = [];
    const currentAchievementIds = this.data.achievements.map(a => a.id);

    achievements.forEach(achievement => {
      if (!currentAchievementIds.includes(achievement.id)) {
        if (achievement.condition(this.data.stats)) {
          this.data.achievements.push({
            ...achievement,
            unlockedAt: new Date().toISOString()
          });
          newAchievements.push(achievement);
        }
      }
    });

    return newAchievements;
  }

  getLeaderboard() {
    // In a real app, this would fetch from a server
    // For now, return user's best scores by topic
    const leaderboard = [];
    
    Object.entries(this.data.stats.topicStats).forEach(([topic, stats]) => {
      leaderboard.push({
        topic,
        bestScore: stats.bestScore,
        quizzesCompleted: stats.quizzesCompleted
      });
    });

    return leaderboard.sort((a, b) => b.bestScore - a.bestScore);
  }

  resetData() {
    this.data = this.getDefaultData();
    this.saveData();
  }
}

export default GameService;
