'use client';

import { useState } from 'react';

export default function ExamPreviewInterface({ 
  exam, 
  course, 
  unit, 
  isAPPrecalculus, 
  examSections 
}) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'section', 'question'
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showInstructions, setShowInstructions] = useState(true);

  const currentSectionData = examSections[currentSection];
  const currentQuestionData = currentSectionData?.questions[currentQuestion];

  // Overview Mode - Shows exam structure
  const renderOverview = () => (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
      {/* Exam Header */}
      <div className="p-6 border-b border-base-300 bg-primary/5">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
          <p className="text-lg text-base-content/70 mb-4">{unit.title} • {course.title}</p>
          
          {exam.description && (
            <div 
              className="prose prose-lg mx-auto mb-4 text-base-content/80"
              dangerouslySetInnerHTML={{ __html: exam.description }}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="stat bg-base-100/50 rounded-box p-4">
              <div className="stat-title">Total Questions</div>
              <div className="stat-value text-primary">
                {examSections.reduce((total, section) => total + section.questions.length, 0)}
              </div>
            </div>
            <div className="stat bg-base-100/50 rounded-box p-4">
              <div className="stat-title">Total Time</div>
              <div className="stat-value text-secondary">
                {examSections.reduce((total, section) => total + section.timeLimit, 0)} min
              </div>
            </div>
            <div className="stat bg-base-100/50 rounded-box p-4">
              <div className="stat-title">Points Possible</div>
              <div className="stat-value text-accent">{exam.totalPoints || 'TBD'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 border-b border-base-300">
        <h2 className="text-xl font-bold mb-3">Instructions</h2>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: exam.instructions || 'No specific instructions provided.' }}
        />
        
        {/* Important Notes */}
        <div className="mt-4 p-4 bg-warning/10 rounded-box">
          <h3 className="font-semibold text-warning mb-2">Important Notes:</h3>
          <ul className="text-sm space-y-1 text-warning/80">
            <li>• You have {exam.maxAttempts} attempt{exam.maxAttempts !== 1 ? 's' : ''} to complete this exam</li>
            <li>• You must complete each section within its time limit</li>
            {isAPPrecalculus && (
              <li>• Calculator policies vary by section - pay attention to section headers</li>
            )}
            <li>• Make sure you have a stable internet connection</li>
            {exam.requiresProctoring && (
              <li>• This exam requires proctoring/supervision</li>
            )}
          </ul>
        </div>
      </div>

      {/* Exam Structure */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Exam Structure</h2>
        <div className="space-y-4">
          {examSections.map((section, index) => (
            <div key={section.id} className="border border-base-300 rounded-lg p-4 hover:bg-base-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-lg">{section.title}</div>
                  <div className={`badge ${section.calculatorRequired ? 'badge-success' : 'badge-warning'}`}>
                    {section.calculatorRequired ? 'Calculator Required' : 'No Calculator'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentSection(index);
                    setCurrentQuestion(0);
                    setViewMode('section');
                  }}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Preview Section
                </button>
              </div>
              
              <p className="text-base-content/70 mb-3">{section.instructions}</p>
              
              <div className="flex items-center gap-6 text-sm text-base-content/60">
                <span><strong>{section.questions.length}</strong> questions</span>
                <span><strong>{section.timeLimit}</strong> minutes</span>
                <span><strong>{calculateSectionPoints(section)}</strong> points</span>
              </div>
            </div>
          ))}
        </div>

        {examSections.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setCurrentSection(0);
                setCurrentQuestion(0);
                setViewMode('section');
              }}
              className="btn btn-primary btn-lg gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Exam Preview
            </button>
          </div>
        )}

        {examSections.length === 0 && (
          <div className="text-center py-8 text-base-content/50">
            <svg className="w-16 h-16 mx-auto mb-4 text-base-content/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">No Questions Available</h3>
            <p className="text-base-content/60 mb-4">This exam doesn't have any questions yet.</p>
            <a href={`/admin/courses/${course.id}/units/${unit.id}/exams/${exam.id}/edit`} className="btn btn-primary">
              Add Questions
            </a>
          </div>
        )}
      </div>
    </div>
  );

  // Section Mode - Shows section overview and questions
  const renderSection = () => {
    if (!currentSectionData) return null;

    return (
      <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
        {/* Section Header */}
        <div className="p-6 border-b border-base-300 bg-primary/5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setViewMode('overview')}
              className="btn btn-ghost btn-sm gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Overview
            </button>
            
            <div className="text-right">
              <div className="text-sm text-base-content/60">Section {currentSection + 1} of {examSections.length}</div>
              <div className="font-medium">Time: {currentSectionData.timeLimit} minutes</div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">{currentSectionData.title}</h1>
          <div className="flex items-center gap-3 mb-3">
            <div className={`badge badge-lg ${currentSectionData.calculatorRequired ? 'badge-success' : 'badge-warning'}`}>
              {currentSectionData.calculatorRequired ? 'Calculator Required' : 'No Calculator'}
            </div>
            <div className="text-base-content/70">
              {currentSectionData.questions.length} questions • {calculateSectionPoints(currentSectionData)} points
            </div>
          </div>
          
          {showInstructions && (
            <div className="bg-info/10 p-4 rounded-box">
              <p className="text-info font-medium">{currentSectionData.instructions}</p>
            </div>
          )}
        </div>

        {/* Question Navigation */}
        <div className="p-4 border-b border-base-300 bg-base-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Questions</h3>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="btn btn-ghost btn-xs"
            >
              {showInstructions ? 'Hide' : 'Show'} Instructions
            </button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {currentSectionData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`btn btn-sm ${
                  currentQuestion === index 
                    ? 'btn-primary' 
                    : selectedAnswers[`${currentSection}-${index}`] 
                      ? 'btn-success' 
                      : 'btn-ghost'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Question */}
        <div className="p-6">
          {currentQuestionData && renderQuestion(currentQuestionData, currentQuestion)}
        </div>

        {/* Navigation Controls */}
        <div className="p-6 border-t border-base-300 bg-base-50">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <button
                onClick={() => setCurrentQuestion(Math.min(currentSectionData.questions.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === currentSectionData.questions.length - 1}
                className="btn btn-ghost btn-sm gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex gap-2">
              {currentSection < examSections.length - 1 && (
                <button
                  onClick={() => {
                    setCurrentSection(currentSection + 1);
                    setCurrentQuestion(0);
                  }}
                  className="btn btn-primary btn-sm gap-2"
                >
                  Next Section
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Question renderer
  const renderQuestion = (question, questionIndex) => {
    const questionKey = `${currentSection}-${questionIndex}`;

    if (question.type === 'multiple-choice') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Question {questionIndex + 1}</h3>
            <div className="text-sm text-base-content/60">
              {question.points || 1} point{(question.points || 1) !== 1 ? 's' : ''}
            </div>
          </div>

          {question.content && (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: question.content }}
            />
          )}

          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center gap-3 p-3 border border-base-300 rounded-lg hover:bg-base-50 cursor-pointer">
                <input
                  type="radio"
                  name={questionKey}
                  value={optionIndex}
                  checked={selectedAnswers[questionKey] === optionIndex}
                  onChange={() => setSelectedAnswers({
                    ...selectedAnswers,
                    [questionKey]: optionIndex
                  })}
                  className="radio radio-primary"
                />
                <div className="flex-1">
                  <div className="font-medium">{String.fromCharCode(65 + optionIndex)}.</div>
                  <div 
                    className="prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: option || `Option ${optionIndex + 1}` }}
                  />
                </div>
              </label>
            )) || (
              <div className="text-center py-4 text-base-content/50">
                No options configured for this question
              </div>
            )}
          </div>

          {question.explanation && selectedAnswers[questionKey] !== undefined && (
            <div className="mt-4 p-4 bg-info/10 rounded-box">
              <h4 className="font-semibold text-info mb-2">Explanation:</h4>
              <div 
                className="prose prose-sm text-info/80"
                dangerouslySetInnerHTML={{ __html: question.explanation }}
              />
            </div>
          )}
        </div>
      );
    }

    if (question.type === 'free-response') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Question {questionIndex + 1}</h3>
            <div className="text-sm text-base-content/60">
              {question.totalPoints || 6} points
            </div>
          </div>

          {question.context && (
            <div className="p-4 bg-base-50 rounded-box">
              <h4 className="font-medium mb-2">Context:</h4>
              <div 
                className="prose prose-sm"
                dangerouslySetInnerHTML={{ __html: question.context }}
              />
            </div>
          )}

          <div className="space-y-6">
            {question.parts?.map((part, partIndex) => (
              <div key={partIndex} className="border border-base-300 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Part {part.part}</h4>
                
                <div className="space-y-4">
                  {part.subParts?.map((subPart, subIndex) => (
                    <div key={subIndex} className="border-l-4 border-primary/30 pl-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium">({subPart.label})</span>
                        <span className="text-sm text-base-content/60">
                          {subPart.points} point{subPart.points !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {subPart.question && (
                        <div 
                          className="prose prose-sm mb-3"
                          dangerouslySetInnerHTML={{ __html: subPart.question }}
                        />
                      )}

                      <div className="bg-base-100 border border-base-300 rounded p-3 min-h-24">
                        <textarea
                          placeholder="Student would enter their answer here..."
                          className="w-full bg-transparent border-none resize-none focus:ring-0"
                          rows="3"
                          disabled
                        />
                      </div>

                      {subPart.rubric && subPart.rubric.length > 0 && (
                        <div className="mt-3 p-3 bg-warning/10 rounded">
                          <h5 className="font-medium text-warning mb-2">Scoring Rubric:</h5>
                          <ul className="text-sm space-y-1 text-warning/80">
                            {subPart.rubric.map((rubricItem, rubricIndex) => (
                              <li key={rubricIndex}>• {rubricItem}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )) || (
                    <div className="text-center py-4 text-base-content/50">
                      No sub-parts configured for this part
                    </div>
                  )}
                </div>
              </div>
            )) || (
              <div className="text-center py-4 text-base-content/50">
                No parts configured for this question
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-8 text-base-content/50">
        <p>Unknown question type: {question.type}</p>
      </div>
    );
  };

  // Helper function to calculate section points
  function calculateSectionPoints(section) {
    return section.questions.reduce((total, question) => {
      if (question.type === 'multiple-choice') {
        return total + (question.points || 1);
      } else if (question.type === 'free-response') {
        return total + (question.totalPoints || 6);
      }
      return total;
    }, 0);
  }

  // Main render
  const renderContent = () => {
    switch (viewMode) {
      case 'section':
        return renderSection();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`btn btn-sm ${viewMode === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
          >
            Overview
          </button>
          {examSections.length > 0 && (
            <button
              onClick={() => setViewMode('section')}
              className={`btn btn-sm ${viewMode === 'section' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Section View
            </button>
          )}
        </div>

        <div className="text-sm text-base-content/60">
          Preview Mode • Changes are not saved
        </div>
      </div>

      {/* Main Content */}
      {renderContent()}
    </div>
  );
}
