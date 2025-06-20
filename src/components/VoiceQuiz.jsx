import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import VoiceService from '../services/voiceService.js';
import { quizTopics } from '../data/quizData.js';

const VoiceQuiz = ({ topic, onQuizComplete, gameService }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeSpent, setTimeSpent] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [quizState, setQuizState] = useState('intro'); // intro, question, waiting, complete
  const [questionStartTime, setQuestionStartTime] = useState(null);
  
  const voiceService = useRef(new VoiceService());
  const questions = quizTopics[topic]?.questions || [];

  useEffect(() => {
    if (voiceEnabled && quizState === 'intro') {
      startQuiz();
    }
  }, [voiceEnabled, quizState]);

  useEffect(() => {
    if (quizState === 'question' && voiceEnabled) {
      speakQuestion();
    }
  }, [currentQuestion, quizState, voiceEnabled]);

  const startQuiz = async () => {
    if (!voiceEnabled) return;
    
    try {
      setIsSpeaking(true);
      await voiceService.current.speak(
        `Welcome to the ${quizTopics[topic].name} quiz! I'll ask you ${questions.length} questions. 
         After each question, I'll give you the options. Just say the letter of your answer: A, B, C, or D. 
         Let's begin!`
      );
      setIsSpeaking(false);
      setQuizState('question');
      setQuestionStartTime(Date.now());
    } catch (error) {
      console.error('Error starting quiz:', error);
      setIsSpeaking(false);
      setQuizState('question');
    }
  };

  const speakQuestion = async () => {
    if (!voiceEnabled || currentQuestion >= questions.length) return;
    
    const question = questions[currentQuestion];
    try {
      setIsSpeaking(true);
      
      const questionText = `Question ${currentQuestion + 1}: ${question.question}`;
      const optionsText = question.options
        .map((option, index) => `${String.fromCharCode(65 + index)}: ${option}`)
        .join('. ');
      
      await voiceService.current.speak(`${questionText}. Your options are: ${optionsText}`);
      setIsSpeaking(false);
      
      // Start listening for answer
      if (voiceEnabled) {
        startListening();
      }
    } catch (error) {
      console.error('Error speaking question:', error);
      setIsSpeaking(false);
    }
  };

  const startListening = async () => {
    if (!voiceService.current.isSupported || isListening) return;
    
    try {
      setIsListening(true);
      setTranscript('');
      const result = await voiceService.current.listen();
      
      setTranscript(result.transcript);
      processAnswer(result.transcript);
    } catch (error) {
      console.error('Error listening:', error);
      setIsListening(false);
    }
  };

  const processAnswer = (transcript) => {
    setIsListening(false);
    
    // Extract answer from transcript
    const answer = extractAnswerFromTranscript(transcript);
    
    if (answer !== null) {
      recordAnswer(answer);
    } else {
      // Ask for clarification
      if (voiceEnabled) {
        voiceService.current.speak("I didn't catch that. Please say A, B, C, or D.");
        setTimeout(() => startListening(), 2000);
      }
    }
  };

  const extractAnswerFromTranscript = (transcript) => {
    const text = transcript.toLowerCase().trim();
    
    // Look for letter answers
    if (text.includes('a') || text.includes('option a')) return 0;
    if (text.includes('b') || text.includes('option b')) return 1;
    if (text.includes('c') || text.includes('option c')) return 2;
    if (text.includes('d') || text.includes('option d')) return 3;
    
    // Look for numbers
    if (text.includes('1') || text.includes('one') || text.includes('first')) return 0;
    if (text.includes('2') || text.includes('two') || text.includes('second')) return 1;
    if (text.includes('3') || text.includes('three') || text.includes('third')) return 2;
    if (text.includes('4') || text.includes('four') || text.includes('fourth')) return 3;
    
    return null;
  };

  const recordAnswer = (answerIndex) => {
    const timeTaken = questionStartTime ? (Date.now() - questionStartTime) / 1000 : 30;
    
    setAnswers(prev => [...prev, answerIndex]);
    setTimeSpent(prev => [...prev, timeTaken]);
    
    const question = questions[currentQuestion];
    const isCorrect = answerIndex === question.correctAnswer;
    
    // Provide feedback
    if (voiceEnabled) {
      const feedback = isCorrect ? "Correct!" : `Incorrect. The correct answer was ${String.fromCharCode(65 + question.correctAnswer)}.`;
      voiceService.current.speak(feedback);
    }
    
    // Move to next question or complete quiz
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prev => prev + 1);
        setQuestionStartTime(Date.now());
        setTranscript('');
      } else {
        completeQuiz();
      }
    }, voiceEnabled ? 3000 : 1000);
  };

  const completeQuiz = () => {
    setQuizState('complete');
    const results = gameService.submitQuizResults(topic, questions, answers, timeSpent);
    onQuizComplete(results);
    
    if (voiceEnabled) {
      const score = Math.round((results.score.correctCount / results.score.totalQuestions) * 100);
      voiceService.current.speak(`Quiz complete! You scored ${score} percent. Great job!`);
    }
  };

  const handleManualAnswer = (answerIndex) => {
    if (quizState === 'question' && !isListening && !isSpeaking) {
      recordAnswer(answerIndex);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled) {
      voiceService.current.stopListening();
      voiceService.current.stopSpeaking();
      setIsListening(false);
      setIsSpeaking(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeSpent([]);
    setTranscript('');
    setQuizState('intro');
    setQuestionStartTime(null);
  };

  if (currentQuestion >= questions.length && quizState !== 'complete') {
    return <div>Loading...</div>;
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {quizTopics[topic].icon} {quizTopics[topic].name} Quiz
        </h2>
        <div className="flex gap-2">
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-full ${voiceEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button
            onClick={restartQuiz}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question */}
      {quizState === 'question' && question && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {question.difficulty} • {question.points} pts
            </span>
          </div>
          
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            {question.question}
          </h3>

          {/* Options */}
          <div className="grid gap-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleManualAnswer(index)}
                disabled={isListening || isSpeaking}
                className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-semibold text-blue-600 mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>

          {/* Voice Controls */}
          {voiceEnabled && (
            <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
              {isSpeaking && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Volume2 className="animate-pulse" size={20} />
                  <span>Speaking question...</span>
                </div>
              )}
              
              {isListening && (
                <div className="flex items-center gap-2 text-red-600">
                  <Mic className="animate-pulse" size={20} />
                  <span>Listening for your answer...</span>
                </div>
              )}
              
              {!isSpeaking && !isListening && (
                <button
                  onClick={startListening}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Mic size={20} />
                  Start Voice Answer
                </button>
              )}
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-sm text-gray-600">You said: </span>
              <span className="font-semibold">{transcript}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading states */}
      {quizState === 'intro' && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your quiz...</p>
        </div>
      )}
    </div>
  );
};

export default VoiceQuiz;
