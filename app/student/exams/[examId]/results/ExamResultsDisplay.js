'use client';

import { useState } from 'react';

export default function ExamResultsDisplay({ 
  attempt, 
  exam, 
  showCorrectAnswers = true, 
  allowReview = true 
}) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showExplanations, setShowExplanations] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'correct', 'incorrect', 'unanswered'

  // Prepare sections from exam structure and attempt data
  const sections = prepareSections(exam, attempt);
  const currentSectionData = sections[currentSection];

  // Filter questions based on current filter
  const filteredQuestions = filterQuestions(currentSectionData?.questions || [], filterType, attempt.answers);

  if (!sections || sections.length === 0) {
    return (
      <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-8">
        <div className="text-center py-8 text-base-content/50">
          <svg className="w-16 h-16 mx-auto mb-4 text-base-content/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-bold mb-2">No Questions Available</h3>
          <p className="text-base-content/60">This exam doesn't have detailed question data available for review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-base-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Question Review
            </h2>
            <p className="text-base-content/70 mt-1">
              Detailed breakdown of your responses {showCorrectAnswers ? 'with correct answers' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <select 
              className="select select-bordered select-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Questions</option>
              <option value="correct">Correct Only</option>
              <option value="incorrect">Incorrect Only</option>
              <option value="unanswered">Unanswered Only</option>
            </select>

            {/* Show Explanations Toggle */}
            <div className="form-control">
              <label className="label cursor-pointer gap-2">
                <span className="label-text text-sm">Explanations</span>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary toggle-sm"
                  checked={showExplanations}
                  onChange={(e) => setShowExplanations(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        {sections.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`btn btn-sm whitespace-nowrap ${
                  currentSection === index ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                {section.title}
                <div className="badge badge-sm ml-2">
                  {section.questions.length}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Section Info */}
      {currentSectionData && (
        <div className="p-4 bg-base-50 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{currentSectionData.title}</h3>
              <p className="text-sm text-base-content/70">{currentSectionData.subtitle}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span>Correct: {currentSectionData.stats.correct}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <span>Incorrect: {currentSectionData.stats.incorrect}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-base-300 rounded-full"></div>
                <span>Unanswered: {currentSectionData.stats.unanswered}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="divide-y divide-base-300">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((questionData, index) => (
            <QuestionReviewItem
              key={`${currentSection}-${questionData.originalIndex}`}
              question={questionData.question}
              questionNumber={questionData.originalIndex + 1}
              sectionType={currentSectionData.type}
              studentAnswer={questionData.studentAnswer}
              correctAnswer={questionData.correctAnswer}
              isCorrect={questionData.isCorrect}
              pointsEarned={questionData.pointsEarned}
              totalPoints={questionData.totalPoints}
              showCorrectAnswers={showCorrectAnswers}
              showExplanations={showExplanations}
              allowReview={allowReview}
            />
          ))
        ) : (
          <div className="p-8 text-center text-base-content/50">
            <svg className="w-12 h-12 mx-auto mb-4 text-base-content/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No questions match the current filter.</p>
            <button 
              onClick={() => setFilterType('all')}
              className="btn btn-ghost btn-sm mt-2"
            >
              Show All Questions
            </button>
          </div>
        )}
      </div>

      {/* Section Summary Footer */}
      {currentSectionData && filteredQuestions.length > 0 && (
        <div className="p-4 border-t border-base-300 bg-base-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-base-content/70">
              Showing {filteredQuestions.length} of {currentSectionData.questions.length} questions
            </div>
            <div className="text-sm">
              <span className="font-medium">Section Score: </span>
              <span className={`${
                currentSectionData.stats.percentage >= 70 ? 'text-success' : 'text-error'
              }`}>
                {currentSectionData.stats.pointsEarned}/{currentSectionData.stats.totalPoints} 
                ({Math.round(currentSectionData.stats.percentage)}%)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual Question Review Component
function QuestionReviewItem({
  question,
  questionNumber,
  sectionType,
  studentAnswer,
  correctAnswer,
  isCorrect,
  pointsEarned,
  totalPoints,
  showCorrectAnswers,
  showExplanations,
  allowReview
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (sectionType === 'multiple-choice') {
    return (
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isCorrect ? 'bg-success text-success-content' : 
              studentAnswer !== undefined ? 'bg-error text-error-content' : 
              'bg-base-300 text-base-content'
            }`}>
              {questionNumber}
            </div>
            <div>
              <h4 className="font-semibold">Question {questionNumber}</h4>
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <span>{pointsEarned}/{totalPoints} points</span>
                {isCorrect ? (
                  <span className="text-success">✓ Correct</span>
                ) : studentAnswer !== undefined ? (
                  <span className="text-error">✗ Incorrect</span>
                ) : (
                  <span className="text-base-content/50">— Unanswered</span>
                )}
              </div>
            </div>
          </div>
          
          {allowReview && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-ghost btn-sm gap-2"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
              <svg 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Question Content Preview */}
        {question.content && (
          <div className="mb-4">
            <div 
              className={`prose prose-sm max-w-none ${!isExpanded ? 'line-clamp-2' : ''}`}
              dangerouslySetInnerHTML={{ __html: question.content }}
            />
          </div>
        )}

        {/* Answer Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Student Answer */}
          <div className="p-3 border border-base-300 rounded-lg">
            <div className="text-sm font-medium text-base-content/70 mb-1">Your Answer</div>
            {studentAnswer !== undefined ? (
              <div className={`font-medium ${isCorrect ? 'text-success' : 'text-error'}`}>
                {String.fromCharCode(65 + studentAnswer)}. {question.options?.[studentAnswer] ? 
                  <span dangerouslySetInnerHTML={{ __html: question.options[studentAnswer] }} /> :
                  'Option not available'
                }
              </div>
            ) : (
              <div className="text-base-content/50 italic">No answer submitted</div>
            )}
          </div>

          {/* Correct Answer */}
          {showCorrectAnswers && (
            <div className="p-3 border border-base-300 rounded-lg bg-success/5">
              <div className="text-sm font-medium text-success/70 mb-1">Correct Answer</div>
              <div className="font-medium text-success">
                {correctAnswer !== undefined ? (
                  <>
                    {String.fromCharCode(65 + correctAnswer)}. {question.options?.[correctAnswer] ? 
                      <span dangerouslySetInnerHTML={{ __html: question.options[correctAnswer] }} /> :
                      'Option not available'
                    }
                  </>
                ) : (
                  'Not available'
                )}
              </div>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && allowReview && (
          <div className="space-y-4">
            {/* All Options */}
            <div>
              <h5 className="font-medium mb-2">All Answer Choices</h5>
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <div 
                    key={index}
                    className={`p-3 border rounded-lg ${
                      index === correctAnswer ? 'border-success bg-success/5' :
                      index === studentAnswer && !isCorrect ? 'border-error bg-error/5' :
                      'border-base-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-medium flex-shrink-0">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <div 
                        className="prose prose-sm max-w-none flex-1"
                        dangerouslySetInnerHTML={{ __html: option }}
                      />
                      {index === correctAnswer && showCorrectAnswers && (
                        <span className="text-success flex-shrink-0">✓</span>
                      )}
                      {index === studentAnswer && !isCorrect && (
                        <span className="text-error flex-shrink-0">✗</span>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="text-base-content/50 italic">No options available</div>
                )}
              </div>
            </div>

            {/* Explanation */}
            {showExplanations && question.explanation && (
              <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                <h5 className="font-medium text-info mb-2">Explanation</h5>
                <div 
                  className="prose prose-sm max-w-none text-info/80"
                  dangerouslySetInnerHTML={{ __html: question.explanation }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (sectionType === 'free-response') {
    return (
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              pointsEarned > 0 ? 'bg-success text-success-content' : 
              studentAnswer ? 'bg-warning text-warning-content' : 
              'bg-base-300 text-base-content'
            }`}>
              {questionNumber}
            </div>
            <div>
              <h4 className="font-semibold">Question {questionNumber}</h4>
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <span>{pointsEarned}/{totalPoints} points</span>
                {pointsEarned === totalPoints ? (
                  <span className="text-success">Full Credit</span>
                ) : pointsEarned > 0 ? (
                  <span className="text-warning">Partial Credit</span>
                ) : studentAnswer ? (
                  <span className="text-error">No Credit</span>
                ) : (
                  <span className="text-base-content/50">— Unanswered</span>
                )}
                <span className="badge badge-info badge-xs">Needs Review</span>
              </div>
            </div>
          </div>
          
          {allowReview && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-ghost btn-sm gap-2"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
              <svg 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Context Preview */}
        {question.context && (
          <div className={`mb-4 p-3 bg-base-50 border border-base-300 rounded-lg ${!isExpanded ? 'line-clamp-3' : ''}`}>
            <h5 className="font-medium text-sm text-base-content/70 mb-2">Context:</h5>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: question.context }}
            />
          </div>
        )}

        {/* Parts Summary */}
        <div className="space-y-3 mb-4">
          {question.parts?.map((part, partIndex) => (
            <div key={partIndex} className="border border-base-300 rounded-lg p-3">
              <h5 className="font-medium mb-2">Part {part.part}</h5>
              <div className="text-sm text-base-content/70">
                {part.subParts?.length || 0} sub-parts • {part.subParts?.reduce((total, sub) => total + (sub.points || 0), 0) || 0} points
              </div>
              {!isExpanded && studentAnswer?.[`${partIndex}-0`] && (
                <div className="mt-2 p-2 bg-base-100 rounded text-sm">
                  <span className="text-base-content/60">Response: </span>
                  <span className="line-clamp-2">{studentAnswer[`${partIndex}-0`]}</span>
                </div>
              )}
            </div>
          )) || (
            <div className="text-center py-4 text-base-content/50">
              No parts configured for this question
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && allowReview && (
          <div className="space-y-6">
            {question.parts?.map((part, partIndex) => (
              <div key={partIndex} className="border border-base-300 rounded-lg p-4">
                <h5 className="font-semibold text-lg mb-4">Part {part.part}</h5>
                
                <div className="space-y-4">
                  {part.subParts?.map((subPart, subIndex) => (
                    <div key={subIndex} className="border-l-4 border-primary/30 pl-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-medium">({subPart.label})</span>
                        <span className="text-sm text-base-content/60">
                          {subPart.points} point{subPart.points !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {subPart.question && (
                        <div 
                          className="prose prose-sm max-w-none mb-3"
                          dangerouslySetInnerHTML={{ __html: subPart.question }}
                        />
                      )}

                      {/* Student Response */}
                      <div className="bg-base-50 border border-base-300 rounded-lg p-3 mb-3">
                        <h6 className="font-medium text-sm text-base-content/70 mb-2">Your Response:</h6>
                        {studentAnswer?.[`${partIndex}-${subIndex}`] ? (
                          <div className="whitespace-pre-wrap text-sm">
                            {studentAnswer[`${partIndex}-${subIndex}`]}
                          </div>
                        ) : (
                          <div className="text-base-content/50 italic text-sm">No response provided</div>
                        )}
                      </div>

                      {/* Rubric (if available) */}
                      {showExplanations && subPart.rubric && subPart.rubric.length > 0 && (
                        <div className="bg-info/10 border border-info/20 rounded-lg p-3">
                          <h6 className="font-medium text-info text-sm mb-2">Scoring Rubric:</h6>
                          <ul className="text-sm space-y-1 text-info/80">
                            {subPart.rubric.map((rubricItem, rubricIndex) => (
                              <li key={rubricIndex} className="flex items-start gap-2">
                                <span>•</span>
                                <span>{rubricItem}</span>
                              </li>
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
                No parts available for this question
              </div>
            )}

            {/* Overall Question Note */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <h6 className="font-medium text-warning mb-2">Grading Note:</h6>
              <p className="text-sm text-warning/80">
                Free response questions require manual grading by your instructor. 
                The score shown is preliminary and may be adjusted after review.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 text-center text-base-content/50">
      <p>Unknown question type</p>
    </div>
  );
}

// Helper function to prepare sections from exam data
function prepareSections(exam, attempt) {
  const sections = [];
  const answers = attempt.answers || {};
  const scoreBreakdown = attempt.scoreBreakdown || {};

  // Multiple Choice Part A
  if (exam.questions?.multipleChoice?.partA?.length > 0) {
    const questions = exam.questions.multipleChoice.partA;
    const sectionResults = scoreBreakdown.sections?.['mc-part-a'];
    
    sections.push({
      id: 'mc-part-a',
      title: 'Section I, Part A: Multiple Choice',
      subtitle: 'No Calculator',
      type: 'multiple-choice',
      questions: questions.map((q, index) => ({
        question: q,
        originalIndex: index,
        studentAnswer: answers[`0-${index}`],
        correctAnswer: q.correctAnswer,
        isCorrect: answers[`0-${index}`] === q.correctAnswer,
        pointsEarned: sectionResults?.questions?.[index]?.pointsEarned || 0,
        totalPoints: q.points || 1
      })),
      stats: calculateSectionStats(questions, answers, 0, sectionResults)
    });
  }

  // Multiple Choice Part B
  if (exam.questions?.multipleChoice?.partB?.length > 0) {
    const questions = exam.questions.multipleChoice.partB;
    const sectionResults = scoreBreakdown.sections?.['mc-part-b'];
    
    sections.push({
      id: 'mc-part-b',
      title: 'Section I, Part B: Multiple Choice',
      subtitle: 'Graphing Calculator Required',
      type: 'multiple-choice',
      questions: questions.map((q, index) => ({
        question: q,
        originalIndex: index,
        studentAnswer: answers[`1-${index}`],
        correctAnswer: q.correctAnswer,
        isCorrect: answers[`1-${index}`] === q.correctAnswer,
        pointsEarned: sectionResults?.questions?.[index]?.pointsEarned || 0,
        totalPoints: q.points || 1
      })),
      stats: calculateSectionStats(questions, answers, 1, sectionResults)
    });
  }

  // Free Response Part A
  if (exam.questions?.freeResponse?.partA?.length > 0) {
    const questions = exam.questions.freeResponse.partA;
    const sectionResults = scoreBreakdown.sections?.['fr-part-a'];
    
    sections.push({
      id: 'fr-part-a',
      title: 'Section II, Part A: Free Response',
      subtitle: 'Graphing Calculator Required',
      type: 'free-response',
      questions: questions.map((q, index) => ({
        question: q,
        originalIndex: index,
        studentAnswer: answers[`2-${index}`],
        correctAnswer: null, // FR questions don't have single correct answers
        isCorrect: null,
        pointsEarned: sectionResults?.questions?.[index]?.pointsEarned || 0,
        totalPoints: q.totalPoints || 6
      })),
      stats: calculateSectionStats(questions, answers, 2, sectionResults)
    });
  }

  // Free Response Part B
  if (exam.questions?.freeResponse?.partB?.length > 0) {
    const questions = exam.questions.freeResponse.partB;
    const sectionResults = scoreBreakdown.sections?.['fr-part-b'];
    
    sections.push({
      id: 'fr-part-b',
      title: 'Section II, Part B: Free Response',
      subtitle: 'No Calculator',
      type: 'free-response',
      questions: questions.map((q, index) => ({
        question: q,
        originalIndex: index,
        studentAnswer: answers[`3-${index}`],
        correctAnswer: null,
        isCorrect: null,
        pointsEarned: sectionResults?.questions?.[index]?.pointsEarned || 0,
        totalPoints: q.totalPoints || 6
      })),
      stats: calculateSectionStats(questions, answers, 3, sectionResults)
    });
  }

  return sections;
}

// Helper function to calculate section statistics
function calculateSectionStats(questions, answers, sectionIndex, sectionResults) {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  let pointsEarned = 0;
  let totalPoints = 0;

  questions.forEach((question, index) => {
    const questionKey = `${sectionIndex}-${index}`;
    const studentAnswer = answers[questionKey];
    const hasAnswer = studentAnswer !== undefined && studentAnswer !== null && studentAnswer !== '';
    
    if (!hasAnswer) {
      unanswered++;
    } else if (question.correctAnswer !== undefined) {
      // Multiple choice
      if (studentAnswer === question.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    } else {
      // Free response - determine based on points earned
      const earned = sectionResults?.questions?.[index]?.pointsEarned || 0;
      const total = question.totalPoints || 6;
      if (earned === total) {
        correct++;
      } else if (earned > 0) {
        // Partial credit counts as neither fully correct nor incorrect
      } else {
        incorrect++;
      }
    }
    
    pointsEarned += sectionResults?.questions?.[index]?.pointsEarned || 0;
    totalPoints += question.points || question.totalPoints || 1;
  });

  return {
    correct,
    incorrect,
    unanswered,
    pointsEarned,
    totalPoints,
    percentage: totalPoints > 0 ? (pointsEarned / totalPoints) * 100 : 0
  };
}

// Helper function to filter questions
function filterQuestions(questions, filterType, answers) {
  if (filterType === 'all') return questions;
  
  return questions.filter(questionData => {
    const hasAnswer = questionData.studentAnswer !== undefined && 
                     questionData.studentAnswer !== null && 
                     questionData.studentAnswer !== '';
    
    switch (filterType) {
      case 'correct':
        return questionData.isCorrect === true || 
               (questionData.isCorrect === null && questionData.pointsEarned === questionData.totalPoints);
      case 'incorrect':
        return (questionData.isCorrect === false) || 
               (questionData.isCorrect === null && hasAnswer && questionData.pointsEarned < questionData.totalPoints);
      case 'unanswered':
        return !hasAnswer;
      default:
        return true;
    }
  });
}
