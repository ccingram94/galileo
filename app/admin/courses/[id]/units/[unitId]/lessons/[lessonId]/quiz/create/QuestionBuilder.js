'use client';

import { useState } from 'react';

export default function QuestionBuilder({ questions, onChange, errors }) {
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  const addQuestion = (type = 'multiple_choice') => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: '',
      options: type === 'multiple_choice' ? ['', '', '', ''] : [],
      correctAnswer: null,
      explanation: ''
    };
    
    const newQuestions = [...questions, newQuestion];
    onChange(newQuestions);
    setExpandedQuestion(newQuestions.length - 1);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    };
    onChange(newQuestions);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    onChange(newQuestions);
    if (expandedQuestion >= newQuestions.length) {
      setExpandedQuestion(Math.max(0, newQuestions.length - 1));
    }
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      options: newOptions
    };
    onChange(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      options: [...newQuestions[questionIndex].options, '']
    };
    onChange(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    const newOptions = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      options: newOptions,
      correctAnswer: newQuestions[questionIndex].correctAnswer >= optionIndex ? 
        Math.max(0, newQuestions[questionIndex].correctAnswer - 1) : 
        newQuestions[questionIndex].correctAnswer
    };
    onChange(newQuestions);
  };

  return (
    <div className="space-y-4">
      {/* Question List */}
      {questions.map((question, index) => (
        <div key={question.id} className="border border-base-300 rounded-box">
          {/* Question Header */}
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-base-50"
            onClick={() => setExpandedQuestion(expandedQuestion === index ? -1 : index)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-btn flex items-center justify-center text-sm font-medium text-primary">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium">
                  {question.question || `Question ${index + 1}`}
                </h4>
                <p className="text-sm text-base-content/60 capitalize">
                  {question.type.replace('_', ' ')} • {question.options?.length || 0} options
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Error indicator */}
              {(errors[`question_${index}`] || errors[`question_${index}_options`] || errors[`question_${index}_answer`]) && (
                <div className="w-2 h-2 bg-error rounded-full"></div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeQuestion(index);
                }}
                className="btn btn-ghost btn-sm text-error hover:bg-error/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <svg 
                className={`w-5 h-5 transition-transform ${expandedQuestion === index ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Question Details */}
          {expandedQuestion === index && (
            <div className="p-4 pt-0 border-t border-base-300">
              <div className="space-y-4">
                {/* Question Text */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Question *</span>
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    className={`textarea textarea-bordered w-full ${errors[`question_${index}`] ? 'textarea-error' : ''}`}
                    placeholder="Enter your question here..."
                    rows={2}
                  />
                  {errors[`question_${index}`] && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors[`question_${index}`]}</span>
                    </div>
                  )}
                </div>

                {/* Question Type */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Question Type</span>
                  </label>
                  <select
                    value={question.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      updateQuestion(index, 'type', newType);
                      if (newType === 'multiple_choice' && (!question.options || question.options.length === 0)) {
                        updateQuestion(index, 'options', ['', '', '', '']);
                      } else if (newType === 'true_false') {
                        updateQuestion(index, 'options', []);
                      }
                      updateQuestion(index, 'correctAnswer', null);
                    }}
                    className="select select-bordered w-full max-w-xs"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                  </select>
                </div>

                {/* Multiple Choice Options */}
                {question.type === 'multiple_choice' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="label-text font-medium">Answer Options</label>
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="btn btn-ghost btn-sm gap-2"
                        disabled={question.options.length >= 6}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Option
                      </button>
                    </div>
                    
                    {errors[`question_${index}_options`] && (
                      <div className="alert alert-warning mb-3">
                        <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errors[`question_${index}_options`]}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correct_${question.id}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                            className="radio radio-primary"
                          />
                          <div className="w-6 h-6 bg-base-200 rounded-btn flex items-center justify-center text-xs font-medium">
                            {String.fromCharCode(65 + optionIndex)}
                          </div>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                            className="input input-bordered input-sm flex-1"
                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                          />
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index, optionIndex)}
                              className="btn btn-ghost btn-sm text-error"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {errors[`question_${index}_answer`] && (
                      <div className="label">
                        <span className="label-text-alt text-error">{errors[`question_${index}_answer`]}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* True/False Options */}
                {question.type === 'true_false' && (
                  <div>
                    <label className="label-text font-medium">Correct Answer</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`tf_${question.id}`}
                          checked={question.correctAnswer === true}
                          onChange={() => updateQuestion(index, 'correctAnswer', true)}
                          className="radio radio-primary"
                        />
                        <span>True</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`tf_${question.id}`}
                          checked={question.correctAnswer === false}
                          onChange={() => updateQuestion(index, 'correctAnswer', false)}
                          className="radio radio-primary"
                        />
                        <span>False</span>
                      </label>
                    </div>
                    
                    {errors[`question_${index}_answer`] && (
                      <div className="label">
                        <span className="label-text-alt text-error">{errors[`question_${index}_answer`]}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Explanation (Optional)</span>
                  </label>
                  <textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                    className="textarea textarea-bordered w-full"
                    placeholder="Explain why this is the correct answer..."
                    rows={2}
                  />
                  <div className="label">
                    <span className="label-text-alt">Students will see this after answering</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Question Buttons */}
      <div className="flex gap-3 justify-center p-4 border border-dashed border-base-300 rounded-box">
        <button
          type="button"
          onClick={() => addQuestion('multiple_choice')}
          className="btn btn-outline gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Multiple Choice
        </button>
        <button
          type="button"
          onClick={() => addQuestion('true_false')}
          className="btn btn-outline gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          True/False
        </button>
      </div>

      {/* Quick Start Templates */}
      {questions.length === 0 && (
        <div className="bg-base-50 rounded-box p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Ready to add questions?</h3>
          <p className="text-base-content/70 mb-4">Start building your quiz by adding questions above.</p>
          
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => {
                // Quick start with 3 multiple choice questions
                const quickQuestions = [
                  {
                    id: Date.now(),
                    type: 'multiple_choice',
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: null,
                    explanation: ''
                  },
                  {
                    id: Date.now() + 1,
                    type: 'multiple_choice',
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: null,
                    explanation: ''
                  },
                  {
                    id: Date.now() + 2,
                    type: 'true_false',
                    question: '',
                    options: [],
                    correctAnswer: null,
                    explanation: ''
                  }
                ];
                onChange(quickQuestions);
                setExpandedQuestion(0);
              }}
              className="btn btn-primary btn-sm"
            >
              Quick Start (3 Questions)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
