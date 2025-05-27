'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuestionEditor from './QuestionEditor';

export default function QuizEditClient({ quiz, questions: initialQuestions, lesson, course, unit }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  
  // Quiz settings state
  const [quizData, setQuizData] = useState({
    title: quiz.title || '',
    description: quiz.description || '',
    passingScore: quiz.passingScore || 70,
    timeLimit: quiz.timeLimit || null,
    isPublished: quiz.isPublished || false,
    allowRetakes: quiz.allowRetakes || false,
    maxAttempts: quiz.maxAttempts || null,
    showCorrectAnswers: quiz.showCorrectAnswers || true,
    randomizeQuestions: quiz.randomizeQuestions || false,
    randomizeOptions: quiz.randomizeOptions || false
  });

  // Questions state
  const [questions, setQuestions] = useState(initialQuestions || []);
  const [hasChanges, setHasChanges] = useState(false);

  const handleQuizDataChange = (field, value) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleQuestionsChange = (newQuestions) => {
    setQuestions(newQuestions);
    setHasChanges(true);
  };

    const handleSave = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(`/api/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...quizData,
            questions: questions
        })
        });

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save quiz');
        }

        setHasChanges(false);
        
        // Show success message (you can implement toast notifications)
        alert('Quiz saved successfully!');
        
        // Refresh the page to get updated data
        router.refresh();
        
    } catch (error) {
        console.error('Error saving quiz:', error);
        alert(error.message || 'Failed to save quiz. Please try again.');
    } finally {
        setIsLoading(false);
    }
    };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push(`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz`);
      }
    } else {
      router.push(`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="bg-warning/10 border border-warning/20 rounded-box p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-warning shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-warning">Unsaved Changes</h3>
              <p className="text-sm text-base-content/70">
                You have unsaved changes. Don't forget to save your work.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
        <div className="tabs tabs-bordered p-4 pb-0">
          <button 
            className={`tab tab-bordered ${activeTab === 'settings' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Quiz Settings
          </button>
          <button 
            className={`tab tab-bordered ${activeTab === 'questions' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            Questions ({questions.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'settings' && (
            <QuizSettingsTab 
              quizData={quizData}
              onDataChange={handleQuizDataChange}
            />
          )}
          
          {activeTab === 'questions' && (
            <QuestionEditor 
              questions={questions}
              onQuestionsChange={handleQuestionsChange}
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-base-100 rounded-box border border-base-300 shadow-sm p-4">
        <div className="text-sm text-base-content/70">
          Last saved: {new Date(quiz.updatedAt).toLocaleString()}
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleCancel}
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className={`btn btn-primary gap-2 ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !hasChanges}
          >
            {!isLoading && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizSettingsTab({ quizData, onDataChange }) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Basic Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Quiz Title</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={quizData.title}
              onChange={(e) => onDataChange('title', e.target.value)}
              placeholder="Enter quiz title..."
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              rows={3}
              value={quizData.description}
              onChange={(e) => onDataChange('description', e.target.value)}
              placeholder="Describe what this quiz covers..."
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Passing Score (%)</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              min="0"
              max="100"
              value={quizData.passingScore}
              onChange={(e) => onDataChange('passingScore', parseInt(e.target.value))}
            />
            <label className="label">
              <span className="label-text-alt">Students need this score to pass</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Time Limit (minutes)</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              min="1"
              value={quizData.timeLimit || ''}
              onChange={(e) => onDataChange('timeLimit', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Leave empty for no time limit"
            />
            <label className="label">
              <span className="label-text-alt">Leave blank for unlimited time</span>
            </label>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-medium">Publish Quiz</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={quizData.isPublished}
                onChange={(e) => onDataChange('isPublished', e.target.checked)}
              />
            </label>
            <label className="label">
              <span className="label-text-alt">Students can only see published quizzes</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-medium">Allow Retakes</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={quizData.allowRetakes}
                onChange={(e) => onDataChange('allowRetakes', e.target.checked)}
              />
            </label>
            <label className="label">
              <span className="label-text-alt">Students can retake the quiz</span>
            </label>
          </div>

          {quizData.allowRetakes && (
            <div className="form-control ml-6">
              <label className="label">
                <span className="label-text font-medium">Max Attempts</span>
              </label>
              <input
                type="number"
                className="input input-bordered input-sm"
                min="1"
                value={quizData.maxAttempts || ''}
                onChange={(e) => onDataChange('maxAttempts', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Unlimited"
              />
              <label className="label">
                <span className="label-text-alt">Leave blank for unlimited attempts</span>
              </label>
            </div>
          )}

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-medium">Show Correct Answers</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={quizData.showCorrectAnswers}
                onChange={(e) => onDataChange('showCorrectAnswers', e.target.checked)}
              />
            </label>
            <label className="label">
              <span className="label-text-alt">Show correct answers after completion</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-medium">Randomize Questions</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={quizData.randomizeQuestions}
                onChange={(e) => onDataChange('randomizeQuestions', e.target.checked)}
              />
            </label>
            <label className="label">
              <span className="label-text-alt">Questions appear in random order</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-medium">Randomize Options</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={quizData.randomizeOptions}
                onChange={(e) => onDataChange('randomizeOptions', e.target.checked)}
              />
            </label>
            <label className="label">
              <span className="label-text-alt">Answer options appear in random order</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
