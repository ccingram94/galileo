'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QuizPreviewClient({ quiz, questions, lesson, course, unit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [viewMode, setViewMode] = useState('quiz'); // 'quiz' or 'summary'

  // Initialize timer if quiz has time limit
  useEffect(() => {
    if (quiz.timeLimit && viewMode === 'quiz') {
      setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz.timeLimit, viewMode]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinishQuiz = () => {
    setShowResults(true);
    setViewMode('summary');
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (viewMode === 'summary') {
    return (
      <div className="space-y-6">
        {/* Quiz Summary */}
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
          <div className="p-6 border-b border-base-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{quiz.title}</h2>
                <p className="text-base-content/70 text-sm mt-1">
                  {quiz.description || 'Quiz completed'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {showResults ? `${calculateScore()}%` : '--'}
                </div>
                <div className="text-sm text-base-content/70">
                  {showResults ? 'Preview Score' : 'Score'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="stat">
                <div className="stat-title">Questions</div>
                <div className="stat-value text-lg">{questions.length}</div>
                <div className="stat-desc">
                  {Object.keys(answers).length} answered
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Passing Score</div>
                <div className="stat-value text-lg">{quiz.passingScore}%</div>
                <div className="stat-desc">Required to pass</div>
              </div>
              <div className="stat">
                <div className="stat-title">Time Limit</div>
                <div className="stat-value text-lg">
                  {quiz.timeLimit ? `${quiz.timeLimit}m` : 'None'}
                </div>
                <div className="stat-desc">
                  {timeLeft !== null ? `${formatTime(timeLeft)} left` : 'No limit'}
                </div>
              </div>
            </div>

            {/* Question Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold">Question Summary</h3>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div 
                    key={index} 
                    className="bg-base-200/50 rounded-btn p-4 cursor-pointer hover:bg-base-200/70 transition-colors"
                    onClick={() => {
                      setCurrentQuestion(index);
                      setViewMode('quiz');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        answers[index] !== undefined 
                          ? showResults && answers[index] === question.correctAnswer
                            ? 'bg-success text-success-content'
                            : showResults
                            ? 'bg-error text-error-content'
                            : 'bg-primary text-primary-content'
                          : 'bg-base-300 text-base-content'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {question.question || question.text}
                        </p>
                        <p className="text-xs text-base-content/70 mt-1">
                          {answers[index] !== undefined ? 'Answered' : 'Not answered'}
                          {showResults && answers[index] !== undefined && (
                            <span className={`ml-2 ${
                              answers[index] === question.correctAnswer ? 'text-success' : 'text-error'
                            }`}>
                              {answers[index] === question.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setViewMode('quiz')}
                className="btn btn-primary"
              >
                Review Questions
              </button>
              <button 
                onClick={() => setShowResults(!showResults)}
                className="btn btn-secondary"
              >
                {showResults ? 'Hide Results' : 'Show Results'}
              </button>
              <Link 
                href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/edit`}
                className="btn btn-ghost"
              >
                Edit Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
        <div className="p-6 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p className="text-base-content/70 text-sm mt-1">
                {quiz.description || `${lesson.title} - Quiz`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-base-content/70">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              {timeLeft !== null && (
                <div className={`text-lg font-mono ${timeLeft < 300 ? 'text-error' : 'text-base-content'}`}>
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-base-200 rounded-full h-2 mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-primary">
                    {currentQuestion + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-4">
                    {question.question || question.text}
                  </h3>

                  {/* Question Options */}
                  {question.options && (
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="flex items-center gap-3 p-3 border border-base-300 rounded-btn cursor-pointer hover:bg-base-200/50 transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion}`}
                            value={optionIndex}
                            checked={answers[currentQuestion] === optionIndex}
                            onChange={(e) => handleAnswerChange(currentQuestion, parseInt(e.target.value))}
                            className="radio radio-primary"
                          />
                          <span className="flex-1">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Text Input for non-multiple choice */}
                  {!question.options && (
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Type your answer here..."
                      rows={4}
                      value={answers[currentQuestion] || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="btn btn-outline btn-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setViewMode('summary')}
                  className="btn btn-ghost btn-sm"
                >
                  View Summary
                </button>
              </div>

              <div className="flex gap-2">
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="btn btn-primary btn-sm"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleFinishQuiz}
                    className="btn btn-success btn-sm"
                  >
                    Finish Preview
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-sm p-4">
        <h4 className="font-medium mb-3">Question Navigation</h4>
        <div className="flex flex-wrap gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`btn btn-sm ${
                index === currentQuestion 
                  ? 'btn-primary' 
                  : answers[index] !== undefined 
                  ? 'btn-success btn-outline' 
                  : 'btn-outline'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
