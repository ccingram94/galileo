'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GradingInterface({ initialData }) {
  const router = useRouter();
  const [gradingData, setGradingData] = useState(initialData);
  const [selectedQuestionId, setSelectedQuestionId] = useState(
    gradingData.frQuestions.find(q => q.response?.gradingStatus === 'pending')?.id || 
    gradingData.frQuestions[0]?.id
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [generalFeedback, setGeneralFeedback] = useState(gradingData.attempt.instructorFeedback || '');

  // Get current question
  const currentQuestion = gradingData.frQuestions.find(q => q.id === selectedQuestionId);
  const currentResponse = currentQuestion?.response;

  // Handle score update for a question
  const updateQuestionScore = async (questionId, score, feedback = '') => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/grading/update-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: gradingData.attempt.id,
          questionId,
          score: parseFloat(score),
          feedback,
          graderId: gradingData.grader.id
        })
      });

      if (response.ok) {
        const updatedResponse = await response.json();
        
        // Update local state
        setGradingData(prev => ({
          ...prev,
          frQuestions: prev.frQuestions.map(q => 
            q.id === questionId 
              ? {
                  ...q,
                  response: { 
                    ...q.response, 
                    instructorScore: score,
                    instructorFeedback: feedback,
                    gradingStatus: 'graded',
                    gradedAt: new Date().toISOString(),
                    gradedBy: gradingData.grader.id
                  }
                }
              : q
          )
        }));

        // Move to next ungraded question
        const nextUngraded = gradingData.frQuestions.find(q => 
          q.id !== questionId && q.response?.gradingStatus === 'pending'
        );
        if (nextUngraded) {
          setSelectedQuestionId(nextUngraded.id);
        }
      } else {
        throw new Error('Failed to update score');
      }
    } catch (error) {
      console.error('Error updating score:', error);
      alert('Failed to save score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle completing the grading
  const completeGrading = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/grading/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: gradingData.attempt.id,
          instructorFeedback: generalFeedback,
          needsReview: gradingData.stats.needsReview
        })
      });

      if (response.ok) {
        alert('Grading completed successfully!');
        router.push('/admin/grading/pending');
      } else {
        throw new Error('Failed to complete grading');
      }
    } catch (error) {
      console.error('Error completing grading:', error);
      alert('Failed to complete grading. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick scoring buttons
  const QuickScoreButtons = ({ question, onScore }) => {
    const maxPoints = question.points || 1;
    const quickScores = [0, Math.round(maxPoints * 0.25), Math.round(maxPoints * 0.5), Math.round(maxPoints * 0.75), maxPoints];
    
    return (
      <div className="flex gap-2 mb-4">
        <span className="text-sm font-medium text-base-content/70 self-center">Quick:</span>
        {quickScores.map(score => (
          <button
            key={score}
            className={`btn btn-sm ${
              currentResponse?.instructorScore === score ? 'btn-primary' : 'btn-outline btn-primary'
            }`}
            onClick={() => onScore(score)}
          >
            {score}/{maxPoints}
          </button>
        ))}
      </div>
    );
  };

  // Render rubric if available
  const RubricDisplay = ({ question }) => {
    if (!question.rubric) return null;
    
    const rubric = typeof question.rubric === 'string' ? JSON.parse(question.rubric) : question.rubric;
    
    return (
      <div className="bg-info/10 rounded-lg p-4 mb-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Grading Rubric
        </h4>
        <div className="space-y-2 text-sm">
          {rubric.levels?.map((level, index) => (
            <div key={index} className="flex justify-between">
              <span>{level.description}</span>
              <span className="font-medium">{level.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar - Question Navigation */}
      <div className="lg:col-span-3">
        <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-4">
          <h3 className="font-bold mb-4">Free Response Questions</h3>
          <div className="space-y-2">
            {gradingData.frQuestions.map((question, index) => {
              const isGraded = question.response?.gradingStatus === 'graded';
              const isSelected = question.id === selectedQuestionId;
              
              return (
                <button
                  key={question.id}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    isSelected 
                      ? 'bg-primary text-primary-content' 
                      : isGraded 
                        ? 'bg-success/20 hover:bg-success/30' 
                        : 'bg-warning/20 hover:bg-warning/30'
                  }`}
                  onClick={() => setSelectedQuestionId(question.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Question {index + 1}</span>
                    <span className="text-xs">
                      {question.response?.instructorScore || 0}/{question.points} pts
                    </span>
                  </div>
                  <div className="text-xs opacity-75 truncate">
                    {question.title || question.question.substring(0, 50) + '...'}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`badge badge-xs ${
                      isGraded ? 'badge-success' : 'badge-warning'
                    }`}>
                      {isGraded ? 'Graded' : 'Pending'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Multiple Choice Summary */}
          {gradingData.mcQuestions.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Multiple Choice Summary</h4>
              <div className="bg-base-200 rounded p-3">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Correct:</span>
                    <span>{gradingData.mcQuestions.filter(q => q.response?.isCorrect).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{gradingData.mcQuestions.length}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                    <span>Score:</span>
                    <span>{Math.round(gradingData.stats.mcScore)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Question and Response */}
      <div className="lg:col-span-6">
        {currentQuestion ? (
          <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-6">
            {/* Question Header */}
            <div className="border-b pb-4 mb-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold">
                  Question {gradingData.frQuestions.findIndex(q => q.id === currentQuestion.id) + 1}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary">{currentQuestion.points} points</span>
                  {currentQuestion.difficulty && (
                    <span className={`badge ${
                      currentQuestion.difficulty === 'hard' ? 'badge-error' :
                      currentQuestion.difficulty === 'medium' ? 'badge-warning' :
                      'badge-success'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                  )}
                </div>
              </div>
              
              {currentQuestion.title && (
                <h3 className="text-lg font-semibold mb-2">{currentQuestion.title}</h3>
              )}
            </div>

            {/* Question Content */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Question:</h4>
              <div 
                className="prose max-w-none bg-base-50 p-4 rounded-lg border"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
              />
            </div>

            {/* Rubric */}
            <RubricDisplay question={currentQuestion} />

            {/* Student Response */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Student Response:</h4>
              {currentResponse?.answer ? (
                <div className="bg-base-50 p-4 rounded-lg border min-h-[200px]">
                  {typeof currentResponse.answer === 'string' ? (
                    <div className="whitespace-pre-wrap">{currentResponse.answer}</div>
                  ) : (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: currentResponse.answer.content || JSON.stringify(currentResponse.answer, null, 2)
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="bg-error/10 p-4 rounded-lg border border-error/20 text-center">
                  <p className="text-error">No response submitted</p>
                </div>
              )}
            </div>

            {/* Previous Grading */}
            {currentResponse?.gradingStatus === 'graded' && (
              <div className="bg-success/10 p-4 rounded-lg border border-success/20 mb-6">
                <h4 className="font-semibold mb-2 text-success">Previously Graded</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-base-content/70">Score:</span>
                    <span className="font-medium ml-2">
                      {currentResponse.instructorScore}/{currentQuestion.points}
                    </span>
                  </div>
                  <div>
                    <span className="text-base-content/70">Grader:</span>
                    <span className="font-medium ml-2">{currentResponse.grader?.name}</span>
                  </div>
                </div>
                {currentResponse.instructorFeedback && (
                  <div className="mt-2">
                    <span className="text-base-content/70">Feedback:</span>
                    <p className="mt-1 text-sm">{currentResponse.instructorFeedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-12 text-center">
            <p className="text-base-content/60">Select a question to begin grading</p>
          </div>
        )}
      </div>

      {/* Right Sidebar - Grading Controls */}
      <div className="lg:col-span-3">
        <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-4 sticky top-4">
          {currentQuestion && (
            <>
              <h3 className="font-bold mb-4">Grading Controls</h3>
              
              {/* Quick Score Buttons */}
              <QuickScoreButtons 
                question={currentQuestion} 
                onScore={(score) => {
                  const feedback = document.getElementById('question-feedback').value;
                  updateQuestionScore(currentQuestion.id, score, feedback);
                }}
              />

              {/* Manual Score Input */}
              <div className="mb-4">
                <label className="label">
                  <span className="label-text font-medium">Score</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max={currentQuestion.points}
                    step="0.5"
                    className="input input-bordered flex-1"
                    defaultValue={currentResponse?.instructorScore || ''}
                    placeholder="0"
                    id="manual-score"
                  />
                  <span className="self-center text-sm text-base-content/70">
                    / {currentQuestion.points}
                  </span>
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-4">
                <label className="label">
                  <span className="label-text font-medium">Feedback (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  placeholder="Provide specific feedback for this response..."
                  defaultValue={currentResponse?.instructorFeedback || ''}
                  id="question-feedback"
                />
              </div>

              {/* Save Score Button */}
              <button
                className="btn btn-primary w-full mb-4"
                disabled={isSubmitting}
                onClick={() => {
                  const score = document.getElementById('manual-score').value;
                  const feedback = document.getElementById('question-feedback').value;
                  if (score === '') {
                    alert('Please enter a score');
                    return;
                  }
                  updateQuestionScore(currentQuestion.id, parseFloat(score), feedback);
                }}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Save Score'
                )}
              </button>

              {/* Navigation */}
              <div className="flex gap-2 mb-6">
                <button
                  className="btn btn-outline btn-sm flex-1"
                  disabled={gradingData.frQuestions.findIndex(q => q.id === selectedQuestionId) === 0}
                  onClick={() => {
                    const currentIndex = gradingData.frQuestions.findIndex(q => q.id === selectedQuestionId);
                    if (currentIndex > 0) {
                      setSelectedQuestionId(gradingData.frQuestions[currentIndex - 1].id);
                    }
                  }}
                >
                  ← Previous
                </button>
                <button
                  className="btn btn-outline btn-sm flex-1"
                  disabled={gradingData.frQuestions.findIndex(q => q.id === selectedQuestionId) === gradingData.frQuestions.length - 1}
                  onClick={() => {
                    const currentIndex = gradingData.frQuestions.findIndex(q => q.id === selectedQuestionId);
                    if (currentIndex < gradingData.frQuestions.length - 1) {
                      setSelectedQuestionId(gradingData.frQuestions[currentIndex + 1].id);
                    }
                  }}
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {/* Complete Grading Section */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Complete Grading</h4>
            <div className="text-sm space-y-1 mb-4">
              <div className="flex justify-between">
                <span>Progress:</span>
                <span>{Math.round(gradingData.stats.gradingProgress)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Current Score:</span>
                <span className={`font-medium ${
                  gradingData.stats.currentScore >= gradingData.exam.passingScore 
                    ? 'text-success' : 'text-error'
                }`}>
                  {Math.round(gradingData.stats.currentScore)}%
                </span>
              </div>
            </div>

            <button
              className="btn btn-success w-full mb-2"
              disabled={!gradingData.stats.canCompleteGrading || isSubmitting}
              onClick={() => setShowFeedbackModal(true)}
            >
              Complete Grading
            </button>

            <p className="text-xs text-base-content/60 text-center">
              {gradingData.stats.canCompleteGrading 
                ? 'All FR questions graded'
                : `${gradingData.stats.totalFRQuestions - gradingData.stats.gradedFRQuestions} questions remaining`
              }
            </p>
          </div>
        </div>
      </div>

      {/* General Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Complete Grading</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Final Score Summary</h4>
              <div className="bg-base-200 p-4 rounded">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>MC Score: {Math.round(gradingData.stats.mcScore)}%</div>
                  <div>FR Score: {Math.round(gradingData.stats.frScore)}%</div>
                  <div className="col-span-2 font-bold text-lg">
                    Final Score: {Math.round(gradingData.stats.currentScore)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="label">
                <span className="label-text font-medium">General Feedback (Optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-32"
                placeholder="Provide overall feedback on the exam performance..."
                value={generalFeedback}
                onChange={(e) => setGeneralFeedback(e.target.value)}
              />
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                disabled={isSubmitting}
                onClick={completeGrading}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Complete & Notify Student'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
