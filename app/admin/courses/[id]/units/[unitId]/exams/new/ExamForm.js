'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic imports to avoid SSR issues
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-32 bg-base-200 rounded-box animate-pulse flex items-center justify-center">Loading editor...</div>
});

const QuestionBuilder = dynamic(() => import('./QuestionBuilder'), {
  ssr: false,
  loading: () => <div className="h-48 bg-base-200 rounded-box animate-pulse flex items-center justify-center">Loading question builder...</div>
});

export default function ExamForm({ 
  course, 
  unit, 
  isAPPrecalculus, 
  initialData = null, 
  examId = null, 
  mode = 'create',
  restrictions = null 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.questions) {
        setQuestions(initialData.questions);
      }
    }
  }, [initialData]);

  // AP Precalculus default configuration
  const getDefaultStructure = () => {
    if (isAPPrecalculus) {
      return {
        multipleChoice: {
          partA: { count: 14, calculatorAllowed: false, timeLimit: 40 },
          partB: { count: 6, calculatorAllowed: true, timeLimit: 20 }
        },
        freeResponse: {
          partA: { count: 1, calculatorAllowed: true, timeLimit: 15 },
          partB: { count: 1, calculatorAllowed: false, timeLimit: 15 }
        }
      };
    }
    return {
      multipleChoice: {
        partA: { count: 15, calculatorAllowed: false, timeLimit: 45 },
        partB: { count: 5, calculatorAllowed: true, timeLimit: 15 }
      },
      freeResponse: {
        partA: { count: 1, calculatorAllowed: true, timeLimit: 20 },
        partB: { count: 1, calculatorAllowed: false, timeLimit: 10 }
      }
    };
  };

const getDefaultFormData = () => ({
  title: `${unit.title} Assessment`,
  description: '',
  instructions: isAPPrecalculus ? 
    'This assessment follows the AP Precalculus exam format. Section I consists of multiple-choice questions, and Section II consists of free-response questions. You will have different time limits for each section.' :
    'This unit assessment covers all major topics from this unit. Read all questions carefully and show your work for full credit.',
  
  // Exam structure
  examType: 'UNIT_ASSESSMENT',
  structure: getDefaultStructure(),
  
  // Timing
  totalTimeLimit: isAPPrecalculus ? 90 : 90,
  allowTimeExtensions: false,
  
  // Scoring - make sure this object exists
  scoring: {
    apStyleScoring: isAPPrecalculus,
    passingScore: 70,
    totalPoints: 100,
    multipleChoiceWeight: 0.6,
    freeResponseWeight: 0.4,
    allowPartialCredit: true
  },
  
  // Settings
  order: (unit.unitExams?.length || 0) + 1,
  maxAttempts: 1,
  shuffleQuestions: false,
  shuffleOptions: true,
  showCorrectAnswers: false,
  allowReviewAfterSubmission: true,
  isPublished: false,
  
  // Availability
  availableFrom: '',
  availableUntil: '',
  requiresProctoring: false
});

const [formData, setFormData] = useState(() => {
  if (initialData) {
    // Ensure scoring object exists when using initialData
    return {
      ...initialData,
      scoring: initialData.scoring || {
        apStyleScoring: isAPPrecalculus,
        passingScore: 70,
        totalPoints: 100,
        multipleChoiceWeight: 0.6,
        freeResponseWeight: 0.4,
        allowPartialCredit: true
      }
    };
  }
  return getDefaultFormData();
});


const [questions, setQuestions] = useState(
  initialData?.questions || {
    multipleChoice: {
      partA: [],
      partB: []
    },
    freeResponse: {
      partA: [],
      partB: []
    }
  }
);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.title.trim()) {
      newErrors.title = 'Exam title is required';
    }
    
    if (formData.title.trim().length < 3) {
      newErrors.title = 'Exam title must be at least 3 characters';
    }

    if (formData.totalTimeLimit < 15 || formData.totalTimeLimit > 300) {
      newErrors.totalTimeLimit = 'Time limit must be between 15 and 300 minutes';
    }

    if ((formData.scoring?.passingScore || 0) < 0 || (formData.scoring?.passingScore || 0) > 100) {
      newErrors.passingScore = 'Passing score must be between 0 and 100';
    }

    if (formData.maxAttempts < 1 || formData.maxAttempts > 10) {
      newErrors.maxAttempts = 'Max attempts must be between 1 and 10';
    }

    // Question validation (only if not restricted)
    if (!restrictions?.questionsLocked) {
      const totalQuestions = getTotalQuestionCount();
      
      // Only require questions if no structure is defined OR if user has configured structure to expect questions
      const expectedQuestions = formData.structure.multipleChoice.partA.count + 
                              formData.structure.multipleChoice.partB.count + 
                              formData.structure.freeResponse.partA.count + 
                              formData.structure.freeResponse.partB.count;
      
      if (expectedQuestions > 0 && totalQuestions === 0) {
        newErrors.questions = 'Please add questions to match your configured structure, or set question counts to 0';
      }

      // AP specific validation
      if (isAPPrecalculus && expectedQuestions > 0) {
        if (formData.structure.multipleChoice.partA.count < 10) {
          newErrors.mcPartA = 'Part A should have at least 10 questions for AP format';
        }
        if (formData.structure.freeResponse.partA.count === 0 && formData.structure.freeResponse.partB.count === 0) {
          newErrors.freeResponse = 'AP format requires at least one free response question';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTotalQuestionCount = () => {
    return (
      questions.multipleChoice.partA.length +
      questions.multipleChoice.partB.length +
      questions.freeResponse.partA.length +
      questions.freeResponse.partB.length
    );
  };

  const getTotalPoints = () => {
    let total = 0;
    Object.values(questions).forEach(section => {
      Object.values(section).forEach(part => {
        part.forEach(q => {
          if (q.type === 'multiple-choice') {
            total += q.points || 1;
          } else if (q.type === 'free-response') {
            total += q.totalPoints || 6;
          }
        });
      });
    });
    return total || (formData.scoring?.totalPoints || 100);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('Submit clicked!'); // Debug log
  console.log('Current formData:', formData); // Debug log
  console.log('Current questions:', questions); // Debug log
  
  const isValid = validateForm();
  console.log('Validation result:', isValid); // Debug log
  console.log('Validation errors:', errors); // Debug log
  
  if (!isValid) {
    console.log('Validation failed, not submitting'); // Debug log
    return;
  }
  
  if (!validateForm()) {
    return;
  }
  
  setLoading(true);

  try {
    const examData = {
      ...formData,
      questions,
      totalPoints: getTotalPoints(),
      unitId: unit.id
    };

    const url = mode === 'edit' 
      ? `/api/admin/courses/${course.id}/units/${unit.id}/exams/${examId}`
      : `/api/admin/courses/${course.id}/units/${unit.id}/exams`;
    
    const method = mode === 'edit' ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examData),
    });

    if (response.ok) {
      const result = await response.json();
      
      if (mode === 'edit') {
        // Show success message and refresh the page to show updated data
        setErrors({ success: 'Exam updated successfully!' });
        router.refresh();
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Redirect to exam list for new exams
        router.push(`/admin/courses/${course.id}/units/${unit.id}/exams`);
      }
    } else {
      const error = await response.json();
      if (error.restrictedFields) {
        setErrors({ 
          submit: error.error,
          restrictedFields: error.restrictedFields
        });
      } else {
        setErrors({ submit: error.error || `Failed to ${mode} exam` });
      }
    }
  } catch (error) {
    console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} exam:`, error);
    setErrors({ submit: `Failed to ${mode} exam. Please try again.` });
  } finally {
    setLoading(false);
  }
};


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Check if this field is restricted
    if (restrictions?.questionsLocked && ['structure', 'totalTimeLimit'].some(field => name.includes(field))) {
      return; // Don't allow changes to restricted fields
    }
    if (restrictions?.scoringLocked && name.includes('scoring')) {
      return;
    }
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = type === 'checkbox' ? checked : 
                                        type === 'number' ? (value === '' ? 0 : Number(value)) : 
                                        value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : 
                type === 'number' ? (value === '' ? 0 : Number(value)) : 
                value
      }));
    }
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRichTextChange = (field, content) => {
    setFormData(prev => ({
      ...prev,
      [field]: content
    }));
  };

  const addQuestion = (section, part, type) => {
    const newQuestion = {
      id: `${section}-${part}-${Date.now()}`,
      type,
      content: '',
      points: type === 'multiple-choice' ? 1 : 6,
      difficulty: 'medium',
      calculatorAllowed: formData.structure[section][part].calculatorAllowed,
      ...(type === 'multiple-choice' ? {
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      } : {
        parts: [{
          part: 'A',
          subParts: [{
            label: 'i',
            question: '',
            points: 2,
            rubric: []
          }]
        }],
        context: '',
        totalPoints: 6
      })
    };

    setQuestions(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [part]: [...prev[section][part], newQuestion]
      }
    }));
  };

  const updateQuestion = (section, part, questionId, updatedQuestion) => {
    setQuestions(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [part]: prev[section][part].map(q => 
          q.id === questionId ? { ...q, ...updatedQuestion } : q
        )
      }
    }));
  };

  const removeQuestion = (section, part, questionId) => {
    setQuestions(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [part]: prev[section][part].filter(q => q.id !== questionId)
      }
    }));
  };

  const tabs = [
    { key: 'details', label: 'Details', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { key: 'structure', label: 'Structure', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { key: 'questions', label: `Questions (${getTotalQuestionCount()})`, icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-3xl font-bold">{mode === 'edit' ? 'Edit Assessment' : 'Create Unit Assessment'}</h1>
        <p className="text-base-content/70 mt-1">
          {mode === 'edit' ? 
            `Editing "${formData.title}" in ${unit.title}` :
            `${isAPPrecalculus ? 'AP Precalculus format exam' : 'Unit assessment exam'} for "${unit.title}" in "${course.title}"`
          }
        </p>
        </div>
        <Link href={`/admin/courses/${course.id}/content`} className="btn btn-ghost gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Course
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
            <div className="flex px-8 pt-8 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`tab tab-bordered whitespace-nowrap ${activeTab === tab.key ? 'tab-active' : ''}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8 space-y-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Exam Title *</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                      placeholder="e.g., Unit 1 Assessment - Polynomial Functions"
                      required
                    />
                    {errors.title && (
                      <div className="label">
                        <span className="label-text-alt text-error">{errors.title}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Exam Order</span>
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      min="1"
                    />
                    <div className="label">
                      <span className="label-text-alt">Position in unit sequence</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Exam Description</span>
                  </label>
                  <RichTextEditor
                    content={formData.description}
                    onChange={(content) => handleRichTextChange('description', content)}
                    placeholder="Provide an overview of what this exam covers and its learning objectives..."
                  />
                  <div className="label">
                    <span className="label-text-alt">Brief description visible to students before taking the exam</span>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Student Instructions</span>
                  </label>
                  <RichTextEditor
                    content={formData.instructions}
                    onChange={(content) => handleRichTextChange('instructions', content)}
                    placeholder="Enter specific instructions for students taking this exam..."
                  />
                  <div className="label">
                    <span className="label-text-alt">Detailed instructions shown to students when starting the exam</span>
                  </div>
                </div>

                {/* AP Format Notice */}
                {isAPPrecalculus && (
                  <div className="alert alert-info">
                    <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-bold">AP Precalculus Format Active</h3>
                      <div className="text-sm">This exam will follow the AP Precalculus exam structure with separate calculator and non-calculator sections.</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'structure' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Exam Structure</h3>
                  <div className="badge badge-primary">
                    {isAPPrecalculus ? 'AP Format' : 'Custom Format'}
                  </div>
                </div>

                {/* Multiple Choice Configuration */}
                <div className="card bg-base-50 border border-base-300">
                  <div className="card-body">
                    <h4 className="card-title text-lg">Multiple Choice Section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Part A */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold">Part A</h5>
                          <div className="badge badge-warning">No Calculator</div>
                        </div>
                        
                        <div>
                          <label className="label">
                            <span className="label-text">Number of Questions</span>
                          </label>
                          <input
                            type="number"
                            name="structure.multipleChoice.partA.count"
                            value={formData.structure.multipleChoice.partA.count}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            min="0"
                            max="30"
                          />
                        </div>

                        <div>
                          <label className="label">
                            <span className="label-text">Time Limit (minutes)</span>
                          </label>
                          <input
                            type="number"
                            name="structure.multipleChoice.partA.timeLimit"
                            value={formData.structure.multipleChoice.partA.timeLimit}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            min="10"
                            max="90"
                          />
                        </div>
                      </div>

                      {/* Part B */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold">Part B</h5>
                          <div className="badge badge-success">Calculator Required</div>
                        </div>
                        
                        <div>
                          <label className="label">
                            <span className="label-text">Number of Questions</span>
                          </label>
                          <input
                            type="number"
                            name="structure.multipleChoice.partB.count"
                            value={formData.structure.multipleChoice.partB.count}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            min="0"
                            max="20"
                          />
                        </div>

                        <div>
                          <label className="label">
                            <span className="label-text">Time Limit (minutes)</span>
                          </label>
                          <input
                            type="number"
                            name="structure.multipleChoice.partB.timeLimit"
                            value={formData.structure.multipleChoice.partB.timeLimit}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            min="10"
                            max="60"
                          />
                        </div>
                      </div>
                    </div>

                    {errors.mcPartA && (
                      <div className="alert alert-error mt-4">
                        <span>{errors.mcPartA}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Free Response Configuration */}
                <div className="card bg-base-50 border border-base-300">
                  <div className="card-body">
                    <h4 className="card-title text-lg">Free Response Section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Part A */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold">Part A</h5>
                          <div className="badge badge-success">Calculator Required</div>
                        </div>
                        
                        <div>
                          <label className="label">
                            <span className="label-text">Number of Questions</span>
                          </label>
                          <input
                            type="number"
                            name="structure.freeResponse.partA.count"
                            value={formData.structure.freeResponse.partA.count}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            min="0"
                            max="4"
                          />
                        </div>

                        <div>
                          <label className="label">
                            <span className="label-text">Time Limit (minutes)</span>
                          </label>
                          <input
                            type="number"
                            name="structure.freeResponse.partA.timeLimit"
                            value={formData.structure.freeResponse.partA.timeLimit}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            min="10"
                            max="60"
                          />
                        </div>
                      </div>

                      {/* Part B */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold">Part B</h5>
                          <div className="badge badge-warning">No Calculator</div>
                        </div>
                        
                        <div>
                          <label className="label">
                            <span className="label-text">Number of Questions</span>
                          </label>
                          <input
                            type="number"
                            name="structure.freeResponse.partB.count"
                            value={formData.structure.freeResponse.partB.count}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            min="0"
                            max="4"
                          />
                        </div>

                        <div>
                          <label className="label">
                            <span className="label-text">Time Limit (minutes)</span>
                          </label>
                          <input
                            type="number"
                            name="structure.freeResponse.partB.timeLimit"
                            value={formData.structure.freeResponse.partB.timeLimit}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            min="10"
                            max="60"
                          />
                        </div>
                      </div>
                    </div>

                    {errors.freeResponse && (
                      <div className="alert alert-error mt-4">
                        <span>{errors.freeResponse}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Structure Summary */}
                <div className="stats shadow border border-base-300">
                  <div className="stat">
                    <div className="stat-title">Total Questions</div>
                    <div className="stat-value text-primary">
                      {formData.structure.multipleChoice.partA.count + 
                       formData.structure.multipleChoice.partB.count + 
                       formData.structure.freeResponse.partA.count + 
                       formData.structure.freeResponse.partB.count}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Total Time</div>
                    <div className="stat-value text-secondary">
                      {formData.structure.multipleChoice.partA.timeLimit + 
                       formData.structure.multipleChoice.partB.timeLimit + 
                       formData.structure.freeResponse.partA.timeLimit + 
                       formData.structure.freeResponse.partB.timeLimit} min
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Estimated Points</div>
                    <div className="stat-value text-accent">
                      {(formData.structure.multipleChoice.partA.count + formData.structure.multipleChoice.partB.count) * 1 + 
                       (formData.structure.freeResponse.partA.count + formData.structure.freeResponse.partB.count) * 6}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Build Exam Questions</h3>
                  <div className="badge badge-info">
                    {getTotalQuestionCount()} / {
                      formData.structure.multipleChoice.partA.count + 
                      formData.structure.multipleChoice.partB.count + 
                      formData.structure.freeResponse.partA.count + 
                      formData.structure.freeResponse.partB.count
                    } Questions
                  </div>
                </div>

                {errors.questions && (
                  <div className="alert alert-error">
                    <span>{errors.questions}</span>
                  </div>
                )}

                {/* Question Sections */}
                <div className="space-y-8">
                  {/* Multiple Choice Part A */}
                  {formData.structure.multipleChoice.partA.count > 0 && (
                    <div className="card bg-base-50 border border-base-300">
                      <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h4 className="card-title">Multiple Choice - Part A</h4>
                            <div className="badge badge-warning">No Calculator</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addQuestion('multipleChoice', 'partA', 'multiple-choice')}
                            className="btn btn-primary btn-sm"
                            disabled={questions.multipleChoice.partA.length >= formData.structure.multipleChoice.partA.count}
                          >
                            Add Question
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {questions.multipleChoice.partA.map((question, index) => (
                            <QuestionBuilder
                              key={question.id}
                              question={question}
                              index={index}
                              onUpdate={(updatedQuestion) => updateQuestion('multipleChoice', 'partA', question.id, updatedQuestion)}
                              onRemove={() => removeQuestion('multipleChoice', 'partA', question.id)}
                              calculatorAllowed={false}
                            />
                          ))}
                          
                          {questions.multipleChoice.partA.length === 0 && (
                            <div className="text-center py-8 text-base-content/50">
                              <p>No questions added yet</p>
                              <button
                                type="button"
                                onClick={() => addQuestion('multipleChoice', 'partA', 'multiple-choice')}
                                className="btn btn-ghost btn-sm mt-2"
                              >
                                Add First Question
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Multiple Choice Part B */}
                  {formData.structure.multipleChoice.partB.count > 0 && (
                    <div className="card bg-base-50 border border-base-300">
                      <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h4 className="card-title">Multiple Choice - Part B</h4>
                            <div className="badge badge-success">Calculator Required</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addQuestion('multipleChoice', 'partB', 'multiple-choice')}
                            className="btn btn-primary btn-sm"
                            disabled={questions.multipleChoice.partB.length >= formData.structure.multipleChoice.partB.count}
                          >
                            Add Question
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {questions.multipleChoice.partB.map((question, index) => (
                            <QuestionBuilder
                              key={question.id}
                              question={question}
                              index={index}
                              onUpdate={(updatedQuestion) => updateQuestion('multipleChoice', 'partB', question.id, updatedQuestion)}
                              onRemove={() => removeQuestion('multipleChoice', 'partB', question.id)}
                              calculatorAllowed={true}
                            />
                          ))}
                          
                          {questions.multipleChoice.partB.length === 0 && (
                            <div className="text-center py-8 text-base-content/50">
                              <p>No questions added yet</p>
                              <button
                                type="button"
                                onClick={() => addQuestion('multipleChoice', 'partB', 'multiple-choice')}
                                className="btn btn-ghost btn-sm mt-2"
                              >
                                Add First Question
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Free Response Part A */}
                  {formData.structure.freeResponse.partA.count > 0 && (
                    <div className="card bg-base-50 border border-base-300">
                      <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h4 className="card-title">Free Response - Part A</h4>
                            <div className="badge badge-success">Calculator Required</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addQuestion('freeResponse', 'partA', 'free-response')}
                            className="btn btn-primary btn-sm"
                            disabled={questions.freeResponse.partA.length >= formData.structure.freeResponse.partA.count}
                          >
                            Add Question
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {questions.freeResponse.partA.map((question, index) => (
                            <QuestionBuilder
                              key={question.id}
                              question={question}
                              index={index}
                              onUpdate={(updatedQuestion) => updateQuestion('freeResponse', 'partA', question.id, updatedQuestion)}
                              onRemove={() => removeQuestion('freeResponse', 'partA', question.id)}
                              calculatorAllowed={true}
                            />
                          ))}
                          
                          {questions.freeResponse.partA.length === 0 && (
                            <div className="text-center py-8 text-base-content/50">
                              <p>No questions added yet</p>
                              <button
                                type="button"
                                onClick={() => addQuestion('freeResponse', 'partA', 'free-response')}
                                className="btn btn-ghost btn-sm mt-2"
                              >
                                Add First Question
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Free Response Part B */}
                  {formData.structure.freeResponse.partB.count > 0 && (
                    <div className="card bg-base-50 border border-base-300">
                      <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h4 className="card-title">Free Response - Part B</h4>
                            <div className="badge badge-warning">No Calculator</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addQuestion('freeResponse', 'partB', 'free-response')}
                            className="btn btn-primary btn-sm"
                            disabled={questions.freeResponse.partB.length >= formData.structure.freeResponse.partB.count}
                          >
                            Add Question
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {questions.freeResponse.partB.map((question, index) => (
                            <QuestionBuilder
                              key={question.id}
                              question={question}
                              index={index}
                              onUpdate={(updatedQuestion) => updateQuestion('freeResponse', 'partB', question.id, updatedQuestion)}
                              onRemove={() => removeQuestion('freeResponse', 'partB', question.id)}
                              calculatorAllowed={false}
                            />
                          ))}
                          
                          {questions.freeResponse.partB.length === 0 && (
                            <div className="text-center py-8 text-base-content/50">
                              <p>No questions added yet</p>
                              <button
                                type="button"
                                onClick={() => addQuestion('freeResponse', 'partB', 'free-response')}
                                className="btn btn-ghost btn-sm mt-2"
                              >
                                Add First Question
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Scoring Configuration */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Scoring & Grading</h3>
                    
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Passing Score (%)</span>
                      </label>
                      <input
                        type="number"
                        name="scoring.passingScore"
                        value={formData.scoring.passingScore}
                        onChange={handleInputChange}
                        className={`input input-bordered w-full ${errors.passingScore ? 'input-error' : ''}`}
                        min="0"
                        max="100"
                      />
                      {errors.passingScore && (
                        <div className="label">
                          <span className="label-text-alt text-error">{errors.passingScore}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text">MC Weight</span>
                        </label>
                        <input
                          type="number"
                          name="scoring.multipleChoiceWeight"
                          value={formData.scoring.multipleChoiceWeight}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                          min="0"
                          max="1"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">FR Weight</span>
                        </label>
                        <input
                          type="number"
                          name="scoring.freeResponseWeight"
                          value={formData.scoring.freeResponseWeight}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                          min="0"
                          max="1"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="scoring.apStyleScoring"
                        checked={formData.scoring.apStyleScoring}
                        onChange={handleInputChange}
                        className="checkbox"
                      />
                      <label className="label-text">Use AP-style scoring (1-5 scale)</label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="scoring.allowPartialCredit"
                        checked={formData.scoring.allowPartialCredit}
                        onChange={handleInputChange}
                        className="checkbox"
                      />
                      <label className="label-text">Allow partial credit on FR questions</label>
                    </div>
                  </div>

                  {/* Exam Behavior */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Exam Behavior</h3>
                    
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Max Attempts</span>
                      </label>
                      <input
                        type="number"
                        name="maxAttempts"
                        value={formData.maxAttempts}
                        onChange={handleInputChange}
                        className={`input input-bordered w-full ${errors.maxAttempts ? 'input-error' : ''}`}
                        min="1"
                        max="10"
                      />
                      {errors.maxAttempts && (
                        <div className="label">
                          <span className="label-text-alt text-error">{errors.maxAttempts}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="shuffleQuestions"
                          checked={formData.shuffleQuestions}
                          onChange={handleInputChange}
                          className="checkbox"
                        />
                        <label className="label-text">Shuffle question order</label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="shuffleOptions"
                          checked={formData.shuffleOptions}
                          onChange={handleInputChange}
                          className="checkbox"
                        />
                        <label className="label-text">Shuffle multiple choice options</label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="showCorrectAnswers"
                          checked={formData.showCorrectAnswers}
                          onChange={handleInputChange}
                          className="checkbox"
                        />
                        <label className="label-text">Show correct answers after submission</label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="allowReviewAfterSubmission"
                          checked={formData.allowReviewAfterSubmission}
                          onChange={handleInputChange}
                          className="checkbox"
                        />
                        <label className="label-text">Allow review after submission</label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="isPublished"
                          checked={formData.isPublished}
                          onChange={handleInputChange}
                          className="checkbox checkbox-primary"
                        />
                        <label className="label-text font-medium">Publish exam immediately</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="card bg-base-50 border border-base-300">
                  <div className="card-body">
                    <h4 className="card-title">Availability Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text">Available From</span>
                        </label>
                        <input
                          type="datetime-local"
                          name="availableFrom"
                          value={formData.availableFrom || ''}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Available Until</span>
                        </label>
                        <input
                          type="datetime-local"
                          name="availableUntil"
                          value={formData.availableUntil || ''}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="requiresProctoring"
                        checked={formData.requiresProctoring}
                        onChange={handleInputChange}
                        className="checkbox"
                      />
                      <label className="label-text">Requires proctoring/supervision</label>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="stats shadow border border-base-300">
                  <div className="stat">
                    <div className="stat-title">Total Questions</div>
                    <div className="stat-value text-primary">{getTotalQuestionCount()}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Estimated Points</div>
                    <div className="stat-value text-secondary">{getTotalPoints()}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Estimated Time</div>
                    <div className="stat-value text-accent">{formData.totalTimeLimit} min</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between p-8 pt-0 border-t border-base-300">
            <Link href={`/admin/courses/${course.id}/content`} className="btn btn-ghost">
              Cancel
            </Link>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary gap-2"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Exam...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {mode === 'edit' ? 'Update Assessment' : 'Create Assessment'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        {/* Success/Error Alerts */}
        {errors.success && (
          <div className="alert alert-success m-8 mb-0">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.success}</span>
          </div>
        )}
      </div>

      {/* Preview Card */}
      {formData.title && (
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
          <div className="p-6 border-b border-base-300">
            <h2 className="text-xl font-semibold">Exam Preview</h2>
            <p className="text-base-content/70 mt-1">How this exam will appear to students</p>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{formData.title}</h3>
                {formData.description && (
                  <div className="text-base-content/70 mb-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: formData.description }} />
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-base-content/70">
                  <div>
                    <span className="font-medium">Total Time:</span>
                    <div>{formData.totalTimeLimit} minutes</div>
                  </div>
                  <div>
                    <span className="font-medium">Questions:</span>
                    <div>{getTotalQuestionCount()}</div>
                  </div>
                  <div>
                    <span className="font-medium">Points:</span>
                    <div>{getTotalPoints()}</div>
                  </div>
                  <div>
                    <span className="font-medium">Attempts:</span>
                    <div>{formData.maxAttempts}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className={`badge badge-sm ${formData.isPublished ? 'badge-success' : 'badge-warning'}`}>
                    {formData.isPublished ? 'Published' : 'Draft'}
                  </span>
                  {isAPPrecalculus && (
                    <span className="badge badge-sm badge-primary">AP Format</span>
                  )}
                  {formData.scoring?.apStyleScoring && (
                    <span className="badge badge-sm badge-info">AP Scoring</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
