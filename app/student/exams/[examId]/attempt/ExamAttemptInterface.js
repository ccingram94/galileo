'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function ExamAttemptInterface({ exam, attempt, user, isAPPrecalculus }) {
  const router = useRouter();
  
  // Core state
  const [currentSection, setCurrentSection] = useState(attempt.currentSection || 0);
  const [currentQuestion, setCurrentQuestion] = useState(attempt.currentQuestion || 0);
  const [answers, setAnswers] = useState(attempt.answers || {});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(null);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const [showSectionTransition, setShowSectionTransition] = useState(false);
  const [examStatus, setExamStatus] = useState('active'); // 'active', 'paused', 'timeExpired'
  const [warningShown, setWarningShown] = useState(false);
  
  // Refs
  const autoSaveTimer = useRef(null);
  const timeTimer = useRef(null);
  const lastSaveTime = useRef(Date.now());

  // Get current section and question data
  const currentSectionData = exam.sections[currentSection];
  const currentQuestionData = currentSectionData?.questions[currentQuestion];
  const questionKey = `${currentSection}-${currentQuestion}`;

  // Initialize timers on mount
  useEffect(() => {
    // Calculate initial time remaining
    if (!timeRemaining) {
      calculateTimeRemaining();
    }

    // Start auto-save timer
    startAutoSave();

    // Start time countdown
    startTimeCountdown();

    // Cleanup on unmount
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
      if (timeTimer.current) clearInterval(timeTimer.current);
    };
  }, []);

  // Auto-save when answers change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      scheduleAutoSave();
    }
  }, [answers]);

  // Section transition effect
  useEffect(() => {
    if (currentSection !== (attempt.currentSection || 0)) {
      setShowSectionTransition(true);
      setTimeout(() => setShowSectionTransition(false), 3000);
    }
  }, [currentSection]);

  // Calculate time remaining
  const calculateTimeRemaining = useCallback(() => {
    const startTime = new Date(attempt.startedAt).getTime();
    const elapsed = Date.now() - startTime;
    
    // Calculate total time limit
    const totalTimeLimit = exam.sections.reduce((total, section) => total + section.timeLimit, 0) * 60 * 1000;
    
    // Calculate section time limits
    let sectionTimeElapsed = 0;
    for (let i = 0; i < currentSection; i++) {
      sectionTimeElapsed += exam.sections[i].timeLimit * 60 * 1000;
    }
    
    const currentSectionStart = startTime + sectionTimeElapsed;
    const currentSectionElapsed = Date.now() - currentSectionStart;
    const currentSectionLimit = currentSectionData.timeLimit * 60 * 1000;
    
    setTimeRemaining(Math.max(0, totalTimeLimit - elapsed));
    setSectionTimeRemaining(Math.max(0, currentSectionLimit - currentSectionElapsed));
  }, [attempt.startedAt, currentSection, currentSectionData, exam.sections]);

  // Start time countdown
  const startTimeCountdown = useCallback(() => {
    if (timeTimer.current) clearInterval(timeTimer.current);
    
    timeTimer.current = setInterval(() => {
      calculateTimeRemaining();
      
      // Check for time warnings
      if (sectionTimeRemaining <= 5 * 60 * 1000 && !warningShown) { // 5 minutes
        setWarningShown(true);
        showTimeWarning();
      }
      
      // Auto-submit when time expires
      if (sectionTimeRemaining <= 0) {
        handleSectionTimeExpired();
      }
    }, 1000);
  }, [calculateTimeRemaining, sectionTimeRemaining, warningShown]);

  // Schedule auto-save
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    
    autoSaveTimer.current = setTimeout(() => {
      saveProgress();
    }, 2000); // Save 2 seconds after last change
  }, []);

  // Start auto-save interval
  const startAutoSave = useCallback(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastSaveTime.current > 30000) { // Save every 30 seconds
        saveProgress();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Save progress to server
  const saveProgress = useCallback(async () => {
    if (autoSaveStatus === 'saving') return;
    
    setAutoSaveStatus('saving');
    lastSaveTime.current = Date.now();

    try {
      const response = await fetch(`/api/student/exams/${exam.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: attempt.id,
          answers,
          currentSection,
          currentQuestion,
          timeRemaining,
          status: examStatus
        })
      });

      if (response.ok) {
        setAutoSaveStatus('saved');
      } else {
        setAutoSaveStatus('error');
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('error');
    }
  }, [answers, currentSection, currentQuestion, timeRemaining, examStatus, attempt.id, exam.id, autoSaveStatus]);

  // Handle answer change
  const handleAnswerChange = useCallback((value, questionKey) => {
    setAnswers(prev => ({
      ...prev,
      [questionKey]: value
    }));
  }, []);

  // Handle question navigation
  const handleQuestionNavigation = useCallback((direction) => {
    const questionsInSection = currentSectionData.questions.length;
    
    if (direction === 'next' && currentQuestion < questionsInSection - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion, currentSectionData]);

  // Handle section navigation  
  const handleSectionNavigation = useCallback((direction) => {
    if (direction === 'next' && currentSection < exam.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
      setWarningShown(false);
    } else if (direction === 'prev' && currentSection > 0) {
      // In real AP exam, can't go back to previous sections
      // But for practice, we might allow it
      if (!isAPPrecalculus) {
        setCurrentSection(currentSection - 1);
        setCurrentQuestion(0);
      }
    }
  }, [currentSection, exam.sections.length, isAPPrecalculus]);

  // Handle section time expired
  const handleSectionTimeExpired = useCallback(() => {
    if (currentSection < exam.sections.length - 1) {
      // Auto-advance to next section
      handleSectionNavigation('next');
    } else {
      // Auto-submit exam
      handleExamSubmit();
    }
  }, [currentSection, exam.sections.length, handleSectionNavigation]);

  // Show time warning
  const showTimeWarning = useCallback(() => {
    // Could show a toast notification or modal
    const audio = new Audio('/sounds/warning.mp3');
    audio.play().catch(() => {}); // Ignore audio errors
  }, []);

  // Handle exam submission
  const handleExamSubmit = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      // Final save before submit
      await saveProgress();
      
      const response = await fetch(`/api/student/exams/${exam.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: attempt.id,
          answers,
          timeUsed: Math.round((Date.now() - new Date(attempt.startedAt).getTime()) / 1000 / 60)
        })
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/student/exams/${exam.id}/results?attemptId=${attempt.id}`);
      } else {
        throw new Error('Failed to submit exam');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      alert('Failed to submit exam. Please try again.');
    }
  }, [answers, attempt.id, exam.id, router, saveProgress]);

  // Format time display
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get time color class
  const getTimeColorClass = (time) => {
    const minutes = Math.floor(time / 1000 / 60);
    if (minutes <= 1) return 'text-error';
    if (minutes <= 5) return 'text-warning';
    return 'text-success';
  };

  // Calculate progress
  const calculateProgress = () => {
    const totalQuestions = exam.sections.reduce((total, section) => total + section.questions.length, 0);
    let answeredQuestions = 0;
    
    exam.sections.forEach((section, sectionIndex) => {
      section.questions.forEach((_, questionIndex) => {
        const key = `${sectionIndex}-${questionIndex}`;
        if (answers[key] !== undefined) {
          answeredQuestions++;
        }
      });
    });
    
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // Section Transition Screen
  if (showSectionTransition) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="bg-base-100 rounded-box shadow-2xl p-8 max-w-2xl text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Section Complete!</h2>
          <p className="text-base-content/70 mb-6">
            You are now entering the next section of the exam.
          </p>
          
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-box mb-6">
            <h3 className="font-semibold text-lg mb-2">{currentSectionData.title}</h3>
            <p className="text-base-content/70 mb-3">{currentSectionData.subtitle}</p>
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {currentSectionData.timeLimit} minutes
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {currentSectionData.questions.length} questions
              </div>
              <div className={`badge ${currentSectionData.calculatorRequired ? 'badge-success' : 'badge-warning'}`}>
                {currentSectionData.calculatorRequired ? 'Calculator Required' : 'No Calculator'}
              </div>
            </div>
          </div>
          
          <div className="loading loading-dots loading-lg"></div>
          <p className="text-sm text-base-content/60 mt-2">Preparing section...</p>
        </div>
      </div>
    );
  }

  // Main Exam Interface
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Exam Info */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-bold text-lg">{exam.title}</h1>
                <div className="text-sm text-base-content/60">
                  {currentSectionData.title}
                </div>
              </div>
              
              <div className={`badge ${currentSectionData.calculatorRequired ? 'badge-success' : 'badge-warning'}`}>
                {currentSectionData.calculatorRequired ? 'Calculator Required' : 'No Calculator'}
              </div>
            </div>

            {/* Time Display */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-base-content/60">Section Time</div>
                <div className={`font-mono font-bold ${getTimeColorClass(sectionTimeRemaining)}`}>
                  {formatTime(sectionTimeRemaining)}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-base-content/60">Total Time</div>
                <div className={`font-mono font-bold ${getTimeColorClass(timeRemaining)}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>

              {/* Auto-save indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  autoSaveStatus === 'saving' ? 'bg-warning animate-pulse' :
                  autoSaveStatus === 'saved' ? 'bg-success' : 'bg-error'
                }`}></div>
                <span className="text-xs text-base-content/60">
                  {autoSaveStatus === 'saving' ? 'Saving...' : 
                   autoSaveStatus === 'saved' ? 'Saved' : 'Error'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Question Navigation Sidebar */}
        <div className="w-64 bg-base-100 border-r border-base-300 p-4">
          <div className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-base-content/60">{calculateProgress()}%</span>
              </div>
              <div className="w-full bg-base-300 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>

            {/* Section Navigation */}
            <div>
              <h3 className="font-medium mb-2">Sections</h3>
              <div className="space-y-1">
                {exam.sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      if (index <= currentSection || !isAPPrecalculus) {
                        setCurrentSection(index);
                        setCurrentQuestion(0);
                      }
                    }}
                    disabled={isAPPrecalculus && index > currentSection}
                    className={`w-full text-left p-2 rounded text-xs transition-colors ${
                      currentSection === index 
                        ? 'bg-primary text-primary-content' 
                        : index < currentSection
                          ? 'bg-success/20 text-success hover:bg-success/30'
                          : 'bg-base-200 hover:bg-base-300'
                    } ${isAPPrecalculus && index > currentSection ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-medium">Section {index + 1}</div>
                    <div className="truncate">{section.title.replace(/^Section [IVX]+,?\s*/, '')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Navigation */}
            <div>
              <h3 className="font-medium mb-2">Questions</h3>
              <div className="grid grid-cols-5 gap-1">
                {currentSectionData.questions.map((_, index) => {
                  const qKey = `${currentSection}-${index}`;
                  const isAnswered = answers[qKey] !== undefined;
                  const isCurrent = currentQuestion === index;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-8 h-8 text-xs rounded transition-colors ${
                        isCurrent 
                          ? 'bg-primary text-primary-content' 
                          : isAnswered
                            ? 'bg-success/20 text-success hover:bg-success/30'
                            : 'bg-base-200 hover:bg-base-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-base-300">
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="btn btn-outline btn-error btn-sm w-full"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>

        {/* Question Display Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {currentQuestionData ? (
              <QuestionDisplay
                question={currentQuestionData}
                questionNumber={currentQuestion + 1}
                sectionNumber={currentSection + 1}
                answer={answers[questionKey]}
                onAnswerChange={(value) => handleAnswerChange(value, questionKey)}
                questionType={currentSectionData.type}
              />
            ) : (
              <div className="text-center py-12 text-base-content/50">
                <p>No questions available in this section.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-base-100 border-t border-base-300 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => handleQuestionNavigation('prev')}
              disabled={currentQuestion === 0}
              className="btn btn-ghost btn-sm gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm text-base-content/60">
              Question {currentQuestion + 1} of {currentSectionData.questions.length} • 
              Section {currentSection + 1} of {exam.sections.length}
            </div>
          </div>

          <div className="flex gap-2">
            {currentQuestion < currentSectionData.questions.length - 1 ? (
              <button
                onClick={() => handleQuestionNavigation('next')}
                className="btn btn-primary btn-sm gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : currentSection < exam.sections.length - 1 ? (
              <button
                onClick={() => handleSectionNavigation('next')}
                className="btn btn-primary btn-sm gap-2"
              >
                Next Section
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="btn btn-success btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <SubmitConfirmModal
          onConfirm={handleExamSubmit}
          onCancel={() => setShowSubmitConfirm(false)}
          isSubmitting={isSubmitting}
          progress={calculateProgress()}
          unansweredCount={exam.sections.reduce((total, section, sIndex) => 
            total + section.questions.filter((_, qIndex) => 
              answers[`${sIndex}-${qIndex}`] === undefined
            ).length, 0
          )}
        />
      )}
    </div>
  );
}

// Question Display Component
function QuestionDisplay({ question, questionNumber, sectionNumber, answer, onAnswerChange, questionType }) {
  if (questionType === 'multiple-choice') {
    return (
      <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            Question {questionNumber}
          </h2>
          <div className="text-sm text-base-content/60">
            {question.points || 1} point{(question.points || 1) !== 1 ? 's' : ''}
          </div>
        </div>

        {question.content && (
          <div 
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: question.content }}
          />
        )}

        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <label 
              key={index} 
              className="flex items-start gap-4 p-4 border border-base-300 rounded-lg hover:bg-base-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name={`question-${questionNumber}`}
                value={index}
                checked={answer === index}
                onChange={(e) => onAnswerChange(parseInt(e.target.value))}
                className="radio radio-primary mt-1 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="font-medium text-base-content/80 mb-1">
                  {String.fromCharCode(65 + index)}.
                </div>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: option || `Option ${index + 1}` }}
                />
              </div>
            </label>
          )) || (
            <div className="text-center py-6 text-base-content/50">
              No answer options available for this question.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (questionType === 'free-response') {
    return (
      <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            Question {questionNumber}
          </h2>
          <div className="text-sm text-base-content/60">
            {question.totalPoints || 6} points
          </div>
        </div>

        {question.context && (
          <div className="bg-base-50 border border-base-300 rounded-box p-4 mb-6">
            <h3 className="font-medium text-base-content/70 mb-2">Context:</h3>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: question.context }}
            />
          </div>
        )}

        <div className="space-y-6">
          {question.parts?.map((part, partIndex) => (
            <div key={partIndex} className="border border-base-300 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Part {part.part}</h3>
              
              <div className="space-y-4">
                {part.subParts?.map((subPart, subIndex) => (
                  <div key={subIndex} className="border-l-4 border-primary/30 pl-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-medium text-base-content/80">
                        ({subPart.label})
                      </span>
                      <span className="text-sm text-base-content/60">
                        {subPart.points} point{subPart.points !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {subPart.question && (
                      <div 
                        className="prose prose-sm max-w-none mb-4"
                        dangerouslySetInnerHTML={{ __html: subPart.question }}
                      />
                    )}

                    <textarea
                      value={answer?.[`${partIndex}-${subIndex}`] || ''}
                      onChange={(e) => {
                        const newAnswer = { ...answer };
                        newAnswer[`${partIndex}-${subIndex}`] = e.target.value;
                        onAnswerChange(newAnswer);
                      }}
                      className="w-full min-h-32 p-4 border border-base-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
                      placeholder="Enter your answer here. Show your work and explain your reasoning."
                    />
                  </div>
                )) || (
                  <div className="text-center py-4 text-base-content/50">
                    No sub-parts available for this part.
                  </div>
                )}
              </div>
            </div>
          )) || (
            <div className="text-center py-6 text-base-content/50">
              No parts available for this question.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-8">
      <div className="text-center py-8 text-base-content/50">
        <p>Unknown question type: {question.type}</p>
      </div>
    </div>
  );
}

// Submit Confirmation Modal
function SubmitConfirmModal({ onConfirm, onCancel, isSubmitting, progress, unansweredCount }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-box shadow-2xl p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-center">Submit Exam?</h3>
        
        <div className="space-y-4 mb-6">
          <div className="stats shadow w-full">
            <div className="stat">
              <div className="stat-title">Progress</div>
              <div className="stat-value text-primary">{progress}%</div>
            </div>
          </div>
          
          {unansweredCount > 0 && (
            <div className="alert alert-warning">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold">Incomplete Answers</h3>
                <div className="text-sm">
                  You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}.
                </div>
              </div>
            </div>
          )}
          
          <p className="text-center text-base-content/70">
            Are you sure you want to submit your exam? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn btn-ghost flex-1"
          >
            Continue Exam
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="btn btn-error flex-1 gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Submit Exam
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
