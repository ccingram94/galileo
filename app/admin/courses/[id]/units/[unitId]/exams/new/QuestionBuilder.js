'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-24 bg-base-200 rounded animate-pulse"></div>
});

export default function QuestionBuilder({ question, index, onUpdate, onRemove, calculatorAllowed }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('content'); // content, options, settings

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { value: 'free-response', label: 'Free Response', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'badge-success' },
    { value: 'medium', label: 'Medium', color: 'badge-warning' },
    { value: 'hard', label: 'Hard', color: 'badge-error' }
  ];

  const apSkills = [
    { value: '1.A', label: '1.A - Solve equations and inequalities' },
    { value: '1.B', label: '1.B - Express equivalent forms' },
    { value: '1.C', label: '1.C - Construct new functions' },
    { value: '2.A', label: '2.A - Identify information from representations' },
    { value: '2.B', label: '2.B - Construct equivalent representations' },
    { value: '3.A', label: '3.A - Describe characteristics' },
    { value: '3.B', label: '3.B - Apply results' },
    { value: '3.C', label: '3.C - Support conclusions' }
  ];

  const handleQuestionChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleContentChange = (content) => {
    onUpdate({ content });
  };

  // Multiple Choice specific functions
  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    if (question.options.length >= 6) return; // Max 6 options
    const newOptions = [...question.options, ''];
    onUpdate({ options: newOptions });
  };

  const removeOption = (optionIndex) => {
    if (question.options.length <= 2) return; // Minimum 2 options
    
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    const newCorrectAnswer = question.correctAnswer >= newOptions.length ? 0 : 
                            question.correctAnswer > optionIndex ? question.correctAnswer - 1 : 
                            question.correctAnswer;
    
    onUpdate({ 
      options: newOptions,
      correctAnswer: newCorrectAnswer
    });
  };

  // Free Response specific functions
  const addPart = () => {
    if (question.parts.length >= 3) return; // Max 3 parts (A, B, C)
    
    const partLabels = ['A', 'B', 'C'];
    const newPart = {
      part: partLabels[question.parts.length],
      subParts: [{
        label: 'i',
        question: '',
        points: 2,
        rubric: []
      }]
    };
    
    onUpdate({ 
      parts: [...question.parts, newPart]
    });
  };

  const updatePart = (partIndex, updatedPart) => {
    const newParts = question.parts.map((part, index) => 
      index === partIndex ? { ...part, ...updatedPart } : part
    );
    onUpdate({ parts: newParts });
  };

  const removePart = (partIndex) => {
    if (question.parts.length <= 1) return; // Minimum 1 part
    
    const newParts = question.parts.filter((_, index) => index !== partIndex);
    onUpdate({ parts: newParts });
  };

  const addSubPart = (partIndex) => {
    const part = question.parts[partIndex];
    if (part.subParts.length >= 3) return; // Max 3 sub-parts
    
    const subPartLabels = ['i', 'ii', 'iii'];
    const newSubPart = {
      label: subPartLabels[part.subParts.length],
      question: '',
      points: 2,
      rubric: []
    };
    
    const updatedPart = {
      ...part,
      subParts: [...part.subParts, newSubPart]
    };
    
    updatePart(partIndex, updatedPart);
  };

  const updateSubPart = (partIndex, subPartIndex, updatedSubPart) => {
    const part = question.parts[partIndex];
    const newSubParts = part.subParts.map((subPart, index) =>
      index === subPartIndex ? { ...subPart, ...updatedSubPart } : subPart
    );
    
    updatePart(partIndex, { subParts: newSubParts });
  };

  const removeSubPart = (partIndex, subPartIndex) => {
    const part = question.parts[partIndex];
    if (part.subParts.length <= 1) return; // Minimum 1 sub-part
    
    const newSubParts = part.subParts.filter((_, index) => index !== subPartIndex);
    updatePart(partIndex, { subParts: newSubParts });
  };

  const getTotalPoints = () => {
    if (question.type === 'multiple-choice') {
      return question.points || 1;
    } else if (question.type === 'free-response') {
      return question.parts?.reduce((total, part) => {
        return total + part.subParts.reduce((partTotal, subPart) => 
          partTotal + (subPart.points || 0), 0);
      }, 0) || 0;
    }
    return 0;
  };

  const subTabs = question.type === 'free-response' ? 
    [
      { key: 'content', label: 'Content' },
      { key: 'parts', label: 'Parts & Scoring' }, 
      { key: 'settings', label: 'Settings' }
    ] : 
    [
      { key: 'content', label: 'Question' },
      { key: 'options', label: 'Answer Options' },
      { key: 'settings', label: 'Settings' }
    ];

  return (
    <div className="bg-base-100 border border-base-300 rounded-box shadow-sm">
      {/* Question Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-50">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-ghost btn-sm"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="font-medium">Question {index + 1}</span>
            
            <select
              value={question.type}
              onChange={(e) => {
                const newType = e.target.value;
                const baseUpdate = { type: newType };
                
                if (newType === 'multiple-choice') {
                  baseUpdate.options = question.options || ['', '', '', ''];
                  baseUpdate.correctAnswer = question.correctAnswer || 0;
                  baseUpdate.explanation = question.explanation || '';
                  baseUpdate.points = question.points || 1;
                  // Remove free-response specific fields
                  delete baseUpdate.parts;
                  delete baseUpdate.context;
                  delete baseUpdate.totalPoints;
                } else if (newType === 'free-response') {
                  baseUpdate.parts = question.parts || [{
                    part: 'A',
                    subParts: [{
                      label: 'i',
                      question: '',
                      points: 2,
                      rubric: []
                    }]
                  }];
                  baseUpdate.context = question.context || '';
                  baseUpdate.totalPoints = question.totalPoints || 6;
                  // Remove multiple-choice specific fields
                  delete baseUpdate.options;
                  delete baseUpdate.correctAnswer;
                  delete baseUpdate.explanation;
                  delete baseUpdate.points;
                }
                
                onUpdate(baseUpdate);
              }}
              className="select select-bordered select-sm"
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <div className={`badge badge-sm ${calculatorAllowed ? 'badge-success' : 'badge-warning'}`}>
                {calculatorAllowed ? 'Calculator' : 'No Calculator'}
              </div>
              
              <div className={`badge badge-sm ${difficultyLevels.find(d => d.value === question.difficulty)?.color || 'badge-ghost'}`}>
                {difficultyLevels.find(d => d.value === question.difficulty)?.label || 'Medium'}
              </div>
              
              <div className="badge badge-sm badge-outline">
                {getTotalPoints()} {getTotalPoints() === 1 ? 'pt' : 'pts'}
              </div>
            </div>
          </div>
        </div>
        
        <button
          type="button"
          onClick={onRemove}
          className="btn btn-ghost btn-sm text-error hover:bg-error/10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Question Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Sub Tabs */}
          <div className="flex gap-2 border-b border-base-200 pb-3">
            {subTabs.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveSubTab(tab.key)}
                className={`btn btn-sm ${activeSubTab === tab.key ? 'btn-primary' : 'btn-ghost'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeSubTab === 'content' && (
            <div className="space-y-4">
              {question.type === 'free-response' && (
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Context/Scenario (Optional)</span>
                  </label>
                  <RichTextEditor
                    content={question.context || ''}
                    onChange={(content) => handleQuestionChange('context', content)}
                    placeholder="Provide context or background information for this question..."
                  />
                  <div className="label">
                    <span className="label-text-alt">Background information that applies to all parts of this question</span>
                  </div>
                </div>
              )}

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    {question.type === 'multiple-choice' ? 'Question Text' : 'Question Title'}
                  </span>
                </label>
                <RichTextEditor
                  content={question.content}
                  onChange={handleContentChange}
                  placeholder={question.type === 'multiple-choice' ? 
                    "Enter your multiple choice question here..." :
                    "Enter a title or brief description for this free response question..."
                  }
                />
              </div>
            </div>
          )}

          {/* Multiple Choice Options Tab */}
          {activeSubTab === 'options' && question.type === 'multiple-choice' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="label-text font-medium">Answer Options</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-base-content/70">
                    {question.options?.length || 0} options
                  </span>
                  {question.options && question.options.length < 6 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="btn btn-ghost btn-xs gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Option
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {question.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-start gap-3 p-3 bg-base-50 rounded-box">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`question-${question.id}-correct`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => handleQuestionChange('correctAnswer', optionIndex)}
                        className="radio radio-success"
                      />
                      <span className="text-sm font-medium">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <RichTextEditor
                        content={option}
                        onChange={(content) => handleOptionChange(optionIndex, content)}
                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                      />
                    </div>
                    
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(optionIndex)}
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

              {/* Explanation */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Explanation (Optional)</span>
                </label>
                <RichTextEditor
                  content={question.explanation || ''}
                  onChange={(content) => handleQuestionChange('explanation', content)}
                  placeholder="Explain why this is the correct answer..."
                />
                <div className="label">
                  <span className="label-text-alt">Shown to students after they submit (if enabled)</span>
                </div>
              </div>
            </div>
          )}

          {/* Free Response Parts Tab */}
          {activeSubTab === 'parts' && question.type === 'free-response' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="label-text font-medium">Question Parts</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-base-content/70">
                    {question.parts?.length || 0} parts, {getTotalPoints()} pts total
                  </span>
                  {question.parts && question.parts.length < 3 && (
                    <button
                      type="button"
                      onClick={addPart}
                      className="btn btn-ghost btn-xs gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Part
                    </button>
                  )}
                </div>
              </div>

              {question.parts?.map((part, partIndex) => (
                <div key={partIndex} className="border border-base-300 rounded-box">
                  <div className="flex items-center justify-between p-3 bg-base-50 border-b border-base-300">
                    <h5 className="font-medium">Part {part.part}</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-base-content/70">
                        {part.subParts?.reduce((sum, sp) => sum + (sp.points || 0), 0)} pts
                      </span>
                      {part.subParts && part.subParts.length < 3 && (
                        <button
                          type="button"
                          onClick={() => addSubPart(partIndex)}
                          className="btn btn-ghost btn-xs"
                        >
                          + Sub-part
                        </button>
                      )}
                      {question.parts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePart(partIndex)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          Remove Part
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3 space-y-4">
                    {part.subParts?.map((subPart, subPartIndex) => (
                      <div key={subPartIndex} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="label-text font-medium">
                            Part {part.part}({subPart.label})
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={subPart.points || 0}
                              onChange={(e) => updateSubPart(partIndex, subPartIndex, { 
                                points: parseInt(e.target.value) || 0 
                              })}
                              className="input input-bordered input-xs w-16"
                              min="0"
                              max="10"
                            />
                            <span className="text-xs">pts</span>
                            {part.subParts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSubPart(partIndex, subPartIndex)}
                                className="btn btn-ghost btn-xs text-error"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <RichTextEditor
                          content={subPart.question}
                          onChange={(content) => updateSubPart(partIndex, subPartIndex, { question: content })}
                          placeholder={`Enter the question for part ${part.part}(${subPart.label})...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {activeSubTab === 'settings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Difficulty Level</span>
                  </label>
                  <select
                    value={question.difficulty || 'medium'}
                    onChange={(e) => handleQuestionChange('difficulty', e.target.value)}
                    className="select select-bordered w-full"
                  >
                    {difficultyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {question.type === 'multiple-choice' && (
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Points</span>
                    </label>
                    <input
                      type="number"
                      value={question.points || 1}
                      onChange={(e) => handleQuestionChange('points', parseInt(e.target.value) || 1)}
                      className="input input-bordered w-full"
                      min="1"
                      max="5"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">AP Skill</span>
                </label>
                <select
                  value={question.skill || ''}
                  onChange={(e) => handleQuestionChange('skill', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Select AP Skill...</option>
                  {apSkills.map(skill => (
                    <option key={skill.value} value={skill.value}>
                      {skill.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Learning Objective (Optional)</span>
                </label>
                <input
                  type="text"
                  value={question.learningObjective || ''}
                  onChange={(e) => handleQuestionChange('learningObjective', e.target.value)}
                  placeholder="e.g., 1.2.A"
                  className="input input-bordered w-full"
                />
                <div className="label">
                  <span className="label-text-alt">Reference to specific learning objective from AP framework</span>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Topics/Tags (Optional)</span>
                </label>
                <input
                  type="text"
                  value={question.tags || ''}
                  onChange={(e) => handleQuestionChange('tags', e.target.value)}
                  placeholder="e.g., polynomial, rational, derivatives"
                  className="input input-bordered w-full"
                />
                <div className="label">
                  <span className="label-text-alt">Comma-separated tags for organization</span>
                </div>
              </div>

              {/* Question Info Summary */}
              <div className="bg-info/5 border border-info/20 rounded-box p-4">
                <h4 className="font-medium text-info mb-2">Question Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-base-content/70">Type:</span>
                    <span className="font-medium ml-2">
                      {questionTypes.find(t => t.value === question.type)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-base-content/70">Calculator:</span>
                    <span className="font-medium ml-2">
                      {calculatorAllowed ? 'Required' : 'Not Allowed'}
                    </span>
                  </div>
                  <div>
                    <span className="text-base-content/70">Points:</span>
                    <span className="font-medium ml-2">{getTotalPoints()}</span>
                  </div>
                  <div>
                    <span className="text-base-content/70">Difficulty:</span>
                    <span className="font-medium ml-2">
                      {difficultyLevels.find(d => d.value === question.difficulty)?.label || 'Medium'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
