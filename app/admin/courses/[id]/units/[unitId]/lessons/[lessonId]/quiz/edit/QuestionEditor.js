'use client';

import { useState } from 'react';

export default function QuestionEditor({ questions, onQuestionsChange }) {
  const [editingIndex, setEditingIndex] = useState(null);

  const addQuestion = () => {
    const newQuestion = {
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
    onQuestionsChange([...questions, newQuestion]);
    setEditingIndex(questions.length);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    onQuestionsChange(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    onQuestionsChange(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push('');
    onQuestionsChange(updatedQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    // Adjust correct answer if needed
    if (updatedQuestions[questionIndex].correctAnswer >= optionIndex) {
      updatedQuestions[questionIndex].correctAnswer = Math.max(0, updatedQuestions[questionIndex].correctAnswer - 1);
    }
    onQuestionsChange(updatedQuestions);
  };

  const deleteQuestion = (index) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      onQuestionsChange(updatedQuestions);
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    }
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = { ...questions[index] };
    questionToDuplicate.question = questionToDuplicate.question + ' (Copy)';
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, questionToDuplicate);
    onQuestionsChange(newQuestions);
  };

  const moveQuestion = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    const updatedQuestions = [...questions];
    [updatedQuestions[index], updatedQuestions[newIndex]] = [updatedQuestions[newIndex], updatedQuestions[index]];
    onQuestionsChange(updatedQuestions);
    
    if (editingIndex === index) {
      setEditingIndex(newIndex);
    } else if (editingIndex === newIndex) {
      setEditingIndex(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Questions</h3>
        <button 
          onClick={addQuestion}
          className="btn btn-primary btn-sm gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 bg-base-200/50 rounded-box">
          <div className="w-12 h-12 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="font-medium mb-2">No Questions Yet</h4>
          <p className="text-sm text-base-content/70 mb-4">Add your first question to get started.</p>
          <button 
            onClick={addQuestion}
            className="btn btn-primary btn-sm"
          >
            Add Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              index={index}
              isEditing={editingIndex === index}
              onStartEdit={() => setEditingIndex(index)}
              onStopEdit={() => setEditingIndex(null)}
              onUpdate={(field, value) => updateQuestion(index, field, value)}
              onUpdateOption={(optionIndex, value) => updateOption(index, optionIndex, value)}
              onAddOption={() => addOption(index)}
              onRemoveOption={(optionIndex) => removeOption(index, optionIndex)}
              onDelete={() => deleteQuestion(index)}
              onDuplicate={() => duplicateQuestion(index)}
              onMove={(direction) => moveQuestion(index, direction)}
              canMoveUp={index > 0}
              canMoveDown={index < questions.length - 1}
              totalQuestions={questions.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionCard({ 
  question, 
  index, 
  isEditing, 
  onStartEdit, 
  onStopEdit, 
  onUpdate, 
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onDelete, 
  onDuplicate, 
  onMove, 
  canMoveUp, 
  canMoveDown,
  totalQuestions
}) {
  if (!isEditing) {
    return (
      <div className="bg-base-200/50 rounded-box p-4">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-primary">{index + 1}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium mb-2">{question.question || 'Untitled Question'}</h4>
            {question.type === 'multiple-choice' && (
              <div className="space-y-1 mb-3">
                {question.options?.map((option, optIndex) => (
                  <div 
                    key={optIndex} 
                    className={`text-sm flex items-center gap-2 ${
                      optIndex === question.correctAnswer ? 'text-success font-medium' : 'text-base-content/70'
                    }`}
                  >
                    <span className="w-4 h-4 border border-base-300 rounded-btn flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <span>{option}</span>
                    {optIndex === question.correctAnswer && (
                      <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
            {question.explanation && (
              <p className="text-sm text-info bg-info/10 rounded-btn p-2">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={onStartEdit}
              className="btn btn-ghost btn-xs"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-300">
                <li><button onClick={onDuplicate}>Duplicate</button></li>
                {canMoveUp && <li><button onClick={() => onMove('up')}>Move Up</button></li>}
                {canMoveDown && <li><button onClick={() => onMove('down')}>Move Down</button></li>}
                <div className="divider my-0"></div>
                <li><button onClick={onDelete} className="text-error">Delete</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 border border-base-300 rounded-box p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-primary-content">{index + 1}</span>
        </div>
        <h4 className="font-medium">Editing Question {index + 1}</h4>
        <div className="ml-auto">
          <button 
            onClick={onStopEdit}
            className="btn btn-ghost btn-sm"
          >
            Done
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Question Text */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Question</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            rows={3}
            value={question.question}
            onChange={(e) => onUpdate('question', e.target.value)}
            placeholder="Enter your question..."
          />
        </div>

        {/* Question Type */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Question Type</span>
          </label>
          <select
            className="select select-bordered"
            value={question.type}
            onChange={(e) => onUpdate('type', e.target.value)}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="short-answer">Short Answer</option>
          </select>
        </div>

        {/* Options for Multiple Choice */}
        {question.type === 'multiple-choice' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="label-text font-medium">Answer Options</label>
              <button 
                onClick={onAddOption}
                className="btn btn-ghost btn-xs gap-1"
                disabled={question.options?.length >= 6}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Option
              </button>
            </div>
            {question.options?.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  className="radio radio-primary"
                  checked={question.correctAnswer === optIndex}
                  onChange={() => onUpdate('correctAnswer', optIndex)}
                />
                <span className="w-6 h-6 bg-base-200 rounded-btn flex items-center justify-center text-xs font-medium shrink-0">
                  {String.fromCharCode(65 + optIndex)}
                </span>
                <input
                  type="text"
                  className="input input-bordered input-sm flex-1"
                  value={option}
                  onChange={(e) => onUpdateOption(optIndex, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                />
                {question.options.length > 2 && (
                  <button
                    onClick={() => onRemoveOption(optIndex)}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* True/False Options */}
        {question.type === 'true-false' && (
          <div className="space-y-3">
            <label className="label-text font-medium">Correct Answer</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`tf-${index}`}
                  className="radio radio-primary"
                  checked={question.correctAnswer === true}
                  onChange={() => onUpdate('correctAnswer', true)}
                />
                <span>True</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`tf-${index}`}
                  className="radio radio-primary"
                  checked={question.correctAnswer === false}
                  onChange={() => onUpdate('correctAnswer', false)}
                />
                <span>False</span>
              </label>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Explanation (Optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            rows={2}
            value={question.explanation || ''}
            onChange={(e) => onUpdate('explanation', e.target.value)}
            placeholder="Explain why this is the correct answer..."
          />
          <label className="label">
            <span className="label-text-alt">This will be shown to students after they answer</span>
          </label>
        </div>
      </div>
    </div>
  );
}
