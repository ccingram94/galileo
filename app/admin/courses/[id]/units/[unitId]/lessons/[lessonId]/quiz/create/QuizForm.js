'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QuestionBuilder from './QuestionBuilder';

export default function QuizForm({ course, unit, lesson }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // basic, questions, settings
  
  const [formData, setFormData] = useState({
    title: `${lesson.title} - Quiz`,
    description: '',
    questions: [],
    passingScore: 70,
    isPublished: false
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Quiz title is required';
    }
    
    if (formData.title.trim().length < 3) {
      newErrors.title = 'Quiz title must be at least 3 characters';
    }

    if (formData.questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    }

    // Validate each question
    formData.questions.forEach((question, index) => {
      if (!question.question?.trim()) {
        newErrors[`question_${index}`] = `Question ${index + 1} text is required`;
      }
      
      if (question.type === 'multiple_choice') {
        if (!question.options || question.options.length < 2) {
          newErrors[`question_${index}_options`] = `Question ${index + 1} needs at least 2 options`;
        }
        if (question.correctAnswer === undefined || question.correctAnswer === null) {
          newErrors[`question_${index}_answer`] = `Question ${index + 1} needs a correct answer`;
        }
      } else if (question.type === 'true_false') {
        if (question.correctAnswer === undefined || question.correctAnswer === null) {
          newErrors[`question_${index}_answer`] = `Question ${index + 1} needs a correct answer`;
        }
      }
    });

    if (formData.passingScore < 0 || formData.passingScore > 100) {
      newErrors.passingScore = 'Passing score must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newQuiz = await response.json();
        router.push(`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz`);
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || 'Failed to create quiz' });
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      setErrors({ submit: 'Failed to create quiz' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleQuestionsChange = (questions) => {
    setFormData(prev => ({
      ...prev,
      questions
    }));
    
    // Clear question-related errors
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('question_') || key === 'questions') {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const questionErrors = Object.keys(errors).filter(key => key.startsWith('question_'));

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Quiz</h1>
          <p className="text-base-content/70 mt-1">
            Create a quiz for "{lesson.title}" in "{unit.title}"
          </p>
        </div>
        <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz`} className="btn btn-ghost gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Quiz
        </Link>
      </div>

      {/* Form */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
        <form onSubmit={handleSubmit}>
          
          {/* Error Alert */}
          {errors.submit && (
            <div className="alert alert-error m-8 mb-0">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-base-300">
            <div className="flex px-8 pt-8">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`tab tab-bordered ${activeTab === 'basic' ? 'tab-active' : ''}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('questions')}
                className={`tab tab-bordered ${activeTab === 'questions' ? 'tab-active' : ''} ${questionErrors.length > 0 || errors.questions ? 'text-error' : ''}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Questions ({formData.questions.length})
                {(questionErrors.length > 0 || errors.questions) && (
                  <div className="w-2 h-2 bg-error rounded-full ml-1"></div>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`tab tab-bordered ${activeTab === 'settings' ? 'tab-active' : ''}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8 space-y-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Quiz Title *</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                      placeholder="e.g., Introduction to Derivatives - Quiz"
                      required
                    />
                    {errors.title && (
                      <div className="label">
                        <span className="label-text-alt text-error">{errors.title}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Quiz Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full h-24"
                    placeholder="Optional: Describe what this quiz covers and any instructions for students..."
                  />
                  <div className="label">
                    <span className="label-text-alt">Students will see this before starting the quiz</span>
                  </div>
                </div>

                {/* Lesson Context */}
                <div className="bg-base-200/50 rounded-box p-6">
                  <h3 className="font-semibold text-lg mb-4">Lesson Context</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-base-content/70">Lesson:</span>
                      <p className="font-medium">{lesson.title}</p>
                    </div>
                    <div>
                      <span className="text-base-content/70">Unit:</span>
                      <p className="font-medium">{unit.title}</p>
                    </div>
                    <div>
                      <span className="text-base-content/70">Course:</span>
                      <p className="font-medium">{course.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Quiz Questions</h3>
                    <p className="text-base-content/70 text-sm">Build questions to test student understanding</p>
                  </div>
                  <div className="text-sm text-base-content/70">
                    {formData.questions.length} question{formData.questions.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {errors.questions && (
                  <div className="alert alert-warning">
                    <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.questions}</span>
                  </div>
                )}

                <QuestionBuilder
                  questions={formData.questions}
                  onChange={handleQuestionsChange}
                  errors={errors}
                />

                {/* Question Guidelines */}
                <div className="bg-info/5 border border-info/20 rounded-box p-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-info flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-info mb-2">Question Writing Tips</h4>
                      <ul className="text-sm text-base-content/70 space-y-1 list-disc list-inside">
                        <li>Write clear, unambiguous questions that test specific concepts</li>
                        <li>For multiple choice: avoid "all of the above" or "none of the above"</li>
                        <li>Make incorrect options plausible but clearly wrong</li>
                        <li>Keep questions focused on the lesson's learning objectives</li>
                        <li>Consider providing explanations for both correct and incorrect answers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Quiz Settings</h3>
                    
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Passing Score (%)</span>
                      </label>
                      <input
                        type="number"
                        name="passingScore"
                        value={formData.passingScore}
                        onChange={handleInputChange}
                        className={`input input-bordered w-full ${errors.passingScore ? 'input-error' : ''}`}
                        min="0"
                        max="100"
                        placeholder="70"
                      />
                      {errors.passingScore && (
                        <div className="label">
                          <span className="label-text-alt text-error">{errors.passingScore}</span>
                        </div>
                      )}
                      <div className="label">
                        <span className="label-text-alt">Students need this score to pass the quiz</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleInputChange}
                        className="checkbox checkbox-primary"
                      />
                      <label className="label-text font-medium">Publish quiz immediately</label>
                    </div>
                    <p className="text-sm text-base-content/70">
                      Published quizzes are available to students. Unpublished quizzes remain as drafts.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Quiz Preview</h3>
                    <div className="bg-base-200/50 rounded-box p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span className="font-medium">{formData.questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passing Score:</span>
                        <span className="font-medium">{formData.passingScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`badge badge-sm ${formData.isPublished ? 'badge-success' : 'badge-warning'}`}>
                          {formData.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Time:</span>
                        <span className="font-medium">{Math.max(1, Math.ceil(formData.questions.length * 1.5))} min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Best Practices */}
                <div className="bg-success/5 border border-success/20 rounded-box p-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-success mb-2">Quiz Best Practices</h4>
                      <ul className="text-sm text-base-content/70 space-y-1 list-disc list-inside">
                        <li>Keep quizzes short (5-10 questions) for better engagement</li>
                        <li>Set a reasonable passing score (70-80% is typical)</li>
                        <li>Test your quiz yourself before publishing</li>
                        <li>Review quiz analytics to identify problem questions</li>
                        <li>Consider allowing multiple attempts for learning</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between p-8 pt-0 border-t border-base-300">
            <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz`} className="btn btn-ghost">
              Cancel
            </Link>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || formData.questions.length === 0}
                className="btn btn-primary gap-2"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Quiz...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Create Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Quiz Preview */}
      {formData.title && formData.questions.length > 0 && (
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
          <div className="p-6 border-b border-base-300">
            <h2 className="text-xl font-semibold">Quiz Preview</h2>
            <p className="text-base-content/70 mt-1">How this quiz will appear to students</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{formData.title}</h3>
              <div className={`badge ${formData.isPublished ? 'badge-success' : 'badge-warning'}`}>
                {formData.isPublished ? 'Published' : 'Draft'}
              </div>
            </div>
            {formData.description && (
              <p className="text-base-content/70">{formData.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <span>{formData.questions.length} question{formData.questions.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>Passing score: {formData.passingScore}%</span>
              <span>•</span>
              <span>Estimated time: {Math.max(1, Math.ceil(formData.questions.length * 1.5))} minutes</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
