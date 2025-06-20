export const quizTopics = {
  science: {
    name: "Science",
    icon: "🔬",
    color: "#3B82F6",
    questions: [
      {
        id: 1,
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Go", "Gd"],
        correctAnswer: 0,
        difficulty: "easy",
        points: 10
      },
      {
        id: 2,
        question: "What planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        difficulty: "easy",
        points: 10
      },
      {
        id: 3,
        question: "What is the speed of light in vacuum?",
        options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
        correctAnswer: 0,
        difficulty: "medium",
        points: 20
      },
      {
        id: 4,
        question: "Which scientist developed the theory of relativity?",
        options: ["Newton", "Einstein", "Galileo", "Darwin"],
        correctAnswer: 1,
        difficulty: "easy",
        points: 10
      },
      {
        id: 5,
        question: "What is the smallest unit of matter?",
        options: ["Molecule", "Atom", "Electron", "Proton"],
        correctAnswer: 1,
        difficulty: "medium",
        points: 20
      }
    ]
  },
  history: {
    name: "History",
    icon: "📚",
    color: "#EF4444",
    questions: [
      {
        id: 6,
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correctAnswer: 1,
        difficulty: "easy",
        points: 10
      },
      {
        id: 7,
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
        correctAnswer: 2,
        difficulty: "easy",
        points: 10
      },
      {
        id: 8,
        question: "Which ancient wonder of the world was located in Alexandria?",
        options: ["Hanging Gardens", "Lighthouse", "Colossus", "Mausoleum"],
        correctAnswer: 1,
        difficulty: "medium",
        points: 20
      },
      {
        id: 9,
        question: "The Renaissance period began in which country?",
        options: ["France", "Germany", "Italy", "Spain"],
        correctAnswer: 2,
        difficulty: "medium",
        points: 20
      },
      {
        id: 10,
        question: "Who painted the ceiling of the Sistine Chapel?",
        options: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"],
        correctAnswer: 1,
        difficulty: "medium",
        points: 20
      }
    ]
  },
  geography: {
    name: "Geography",
    icon: "🌍",
    color: "#10B981",
    questions: [
      {
        id: 11,
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correctAnswer: 2,
        difficulty: "medium",
        points: 20
      },
      {
        id: 12,
        question: "Which is the longest river in the world?",
        options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
        correctAnswer: 1,
        difficulty: "easy",
        points: 10
      },
      {
        id: 13,
        question: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        difficulty: "easy",
        points: 10
      },
      {
        id: 14,
        question: "Which country has the most time zones?",
        options: ["Russia", "USA", "China", "Canada"],
        correctAnswer: 0,
        difficulty: "hard",
        points: 30
      },
      {
        id: 15,
        question: "What is the smallest country in the world?",
        options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        correctAnswer: 1,
        difficulty: "medium",
        points: 20
      }
    ]
  },
  sports: {
    name: "Sports",
    icon: "⚽",
    color: "#F59E0B",
    questions: [
      {
        id: 16,
        question: "How many players are on a basketball team on the court?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 1,
        difficulty: "easy",
        points: 10
      },
      {
        id: 17,
        question: "Which sport is known as 'The Beautiful Game'?",
        options: ["Basketball", "Tennis", "Football/Soccer", "Baseball"],
        correctAnswer: 2,
        difficulty: "easy",
        points: 10
      },
      {
        id: 18,
        question: "In which sport would you perform a slam dunk?",
        options: ["Volleyball", "Basketball", "Tennis", "Badminton"],
        correctAnswer: 1,
        difficulty: "easy",
        points: 10
      },
      {
        id: 19,
        question: "How often are the Summer Olympics held?",
        options: ["Every 2 years", "Every 3 years", "Every 4 years", "Every 5 years"],
        correctAnswer: 2,
        difficulty: "easy",
        points: 10
      },
      {
        id: 20,
        question: "Which country has won the most FIFA World Cups?",
        options: ["Germany", "Argentina", "Brazil", "Italy"],
        correctAnswer: 2,
        difficulty: "medium",
        points: 20
      }
    ]
  }
};

export const achievements = [
  {
    id: "first_quiz",
    name: "Getting Started",
    description: "Complete your first quiz",
    icon: "🎯",
    condition: (stats) => stats.quizzesCompleted >= 1
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Get 100% on any quiz",
    icon: "💯",
    condition: (stats) => stats.perfectScores >= 1
  },
  {
    id: "streak_5",
    name: "On Fire",
    description: "Answer 5 questions correctly in a row",
    icon: "🔥",
    condition: (stats) => stats.maxStreak >= 5
  },
  {
    id: "total_100",
    name: "Century",
    description: "Answer 100 questions correctly",
    icon: "💪",
    condition: (stats) => stats.totalCorrect >= 100
  },
  {
    id: "all_topics",
    name: "Well Rounded",
    description: "Complete quizzes in all topics",
    icon: "🌟",
    condition: (stats) => Object.keys(stats.topicStats || {}).length >= 4
  }
];

export const difficultyMultipliers = {
  easy: 1,
  medium: 2,
  hard: 3
};
