'use client';

import { useState } from 'react';

export default function ScoreBreakdownChart({ scoreBreakdown, isAPPrecalculus }) {
  const [viewMode, setViewMode] = useState('sections'); // 'sections', 'types', 'detailed'

  if (!scoreBreakdown || Object.keys(scoreBreakdown).length === 0) {
    return (
      <div className="text-center py-8 text-base-content/50">
        <svg className="w-12 h-12 mx-auto mb-4 text-base-content/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p>Score breakdown data is not available.</p>
      </div>
    );
  }

  const chartData = prepareChartData(scoreBreakdown, isAPPrecalculus);

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="btn-group">
          <button
            onClick={() => setViewMode('sections')}
            className={`btn btn-sm ${viewMode === 'sections' ? 'btn-active' : 'btn-ghost'}`}
          >
            By Section
          </button>
          <button
            onClick={() => setViewMode('types')}
            className={`btn btn-sm ${viewMode === 'types' ? 'btn-active' : 'btn-ghost'}`}
          >
            By Type
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`btn btn-sm ${viewMode === 'detailed' ? 'btn-active' : 'btn-ghost'}`}
          >
            Detailed
          </button>
        </div>
        
        <div className="text-sm text-base-content/60">
          Overall: {chartData.overall.earned}/{chartData.overall.total} points ({Math.round(chartData.overall.percentage)}%)
        </div>
      </div>

      {/* Chart Content */}
      {viewMode === 'sections' && <SectionBreakdownView data={chartData} />}
      {viewMode === 'types' && <QuestionTypeView data={chartData} />}
      {viewMode === 'detailed' && <DetailedBreakdownView data={chartData} />}
    </div>
  );
}

// Section-by-section breakdown
function SectionBreakdownView({ data }) {
  return (
    <div className="space-y-4">
      {data.sections.map((section, index) => (
        <div key={section.id} className="bg-base-50 border border-base-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold">{section.name}</h4>
              <p className="text-sm text-base-content/70">{section.subtitle}</p>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${
                section.percentage >= 70 ? 'text-success' : 
                section.percentage >= 50 ? 'text-warning' : 'text-error'
              }`}>
                {Math.round(section.percentage)}%
              </div>
              <div className="text-sm text-base-content/60">
                {section.earned}/{section.total} points
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-base-300 rounded-full h-3 mb-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                section.percentage >= 70 ? 'bg-success' : 
                section.percentage >= 50 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${Math.min(100, section.percentage)}%` }}
            ></div>
          </div>

          {/* Question Statistics */}
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-success">{section.correct}</div>
              <div className="text-base-content/60">Correct</div>
            </div>
            <div>
              <div className="font-semibold text-error">{section.incorrect}</div>
              <div className="text-base-content/60">Incorrect</div>
            </div>
            <div>
              <div className="font-semibold text-base-content/50">{section.unanswered}</div>
              <div className="text-base-content/60">Unanswered</div>
            </div>
          </div>

          {/* Calculator Info */}
          <div className="mt-3 pt-3 border-t border-base-300">
            <div className={`badge badge-sm ${section.calculatorRequired ? 'badge-success' : 'badge-warning'}`}>
              {section.calculatorRequired ? 'Calculator Required' : 'No Calculator'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Question type comparison
function QuestionTypeView({ data }) {
  const maxPercentage = Math.max(data.multipleChoice.percentage, data.freeResponse.percentage);
  
  return (
    <div className="space-y-6">
      {/* Overall Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multiple Choice */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-primary">Multiple Choice</h4>
            <div className="text-2xl font-bold text-primary">
              {Math.round(data.multipleChoice.percentage)}%
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Points Earned:</span>
              <span className="font-medium">{data.multipleChoice.earned}/{data.multipleChoice.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Questions:</span>
              <span className="font-medium">{data.multipleChoice.count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average per Question:</span>
              <span className="font-medium">
                {data.multipleChoice.count > 0 ? 
                  (data.multipleChoice.earned / data.multipleChoice.count).toFixed(1) : '0'
                } pts
              </span>
            </div>
          </div>

          {/* Visual Bar */}
          <div className="mt-4">
            <div className="w-full bg-base-300 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-700"
                style={{ width: `${data.multipleChoice.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Free Response */}
        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-secondary">Free Response</h4>
            <div className="text-2xl font-bold text-secondary">
              {Math.round(data.freeResponse.percentage)}%
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Points Earned:</span>
              <span className="font-medium">{data.freeResponse.earned}/{data.freeResponse.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Questions:</span>
              <span className="font-medium">{data.freeResponse.count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average per Question:</span>
              <span className="font-medium">
                {data.freeResponse.count > 0 ? 
                  (data.freeResponse.earned / data.freeResponse.count).toFixed(1) : '0'
                } pts
              </span>
            </div>
          </div>

          {/* Visual Bar */}
          <div className="mt-4">
            <div className="w-full bg-base-300 rounded-full h-2">
              <div 
                className="bg-secondary h-2 rounded-full transition-all duration-700"
                style={{ width: `${data.freeResponse.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Analysis */}
      <div className="bg-base-50 border border-base-300 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Performance Comparison</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Stronger Area:</span>
            <span className={`font-medium ${
              data.multipleChoice.percentage > data.freeResponse.percentage ? 'text-primary' : 'text-secondary'
            }`}>
              {data.multipleChoice.percentage > data.freeResponse.percentage ? 
                'Multiple Choice' : 'Free Response'
              } (+{Math.abs(data.multipleChoice.percentage - data.freeResponse.percentage).toFixed(1)}%)
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Total Questions:</span>
            <span className="font-medium">{data.multipleChoice.count + data.freeResponse.count}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Question Distribution:</span>
            <span className="text-sm">
              {data.multipleChoice.count} MC ({Math.round((data.multipleChoice.count / (data.multipleChoice.count + data.freeResponse.count)) * 100)}%) • 
              {data.freeResponse.count} FR ({Math.round((data.freeResponse.count / (data.multipleChoice.count + data.freeResponse.count)) * 100)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {generateTypeBasedRecommendations(data).length > 0 && (
        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <h4 className="font-semibold text-info mb-3">Recommendations</h4>
          <ul className="space-y-2">
            {generateTypeBasedRecommendations(data).map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-info/80">
                <span className="text-info mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Detailed question-by-question breakdown
function DetailedBreakdownView({ data }) {
  return (
    <div className="space-y-6">
      {data.sections.map((section) => (
        <div key={section.id} className="bg-base-50 border border-base-300 rounded-lg">
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{section.name}</h4>
              <div className="text-sm">
                {section.earned}/{section.total} points ({Math.round(section.percentage)}%)
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {section.questions && section.questions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.questions.map((question, index) => (
                  <div 
                    key={index}
                    className={`p-3 border rounded-lg ${
                      question.isCorrect === true ? 'border-success bg-success/10' :
                      question.isCorrect === false ? 'border-error bg-error/10' :
                      question.pointsEarned > 0 ? 'border-warning bg-warning/10' :
                      'border-base-300 bg-base-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Question {index + 1}</span>
                      <span className={`text-xs font-medium ${
                        question.isCorrect === true ? 'text-success' :
                        question.isCorrect === false ? 'text-error' :
                        question.pointsEarned > 0 ? 'text-warning' :
                        'text-base-content/50'
                      }`}>
                        {question.pointsEarned}/{question.totalPoints}
                      </span>
                    </div>
                    
                    <div className="w-full bg-base-300 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          question.isCorrect === true ? 'bg-success' :
                          question.isCorrect === false ? 'bg-error' :
                          question.pointsEarned > 0 ? 'bg-warning' :
                          'bg-base-content/20'
                        }`}
                        style={{ 
                          width: `${question.totalPoints > 0 ? (question.pointsEarned / question.totalPoints) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="mt-2 text-xs text-base-content/60">
                      {question.isCorrect === true ? 'Correct' :
                       question.isCorrect === false ? 'Incorrect' :
                       question.pointsEarned > 0 ? 'Partial Credit' :
                       'No Credit'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-base-content/50 text-sm">
                No detailed question data available for this section
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to prepare chart data
function prepareChartData(scoreBreakdown, isAPPrecalculus) {
  const sections = [];
  let totalEarned = 0;
  let totalPoints = 0;

  // Process each section
  Object.entries(scoreBreakdown.sections || {}).forEach(([sectionId, sectionData]) => {
    const sectionInfo = getSectionInfo(sectionId, isAPPrecalculus);
    
    const earned = sectionData.earnedPoints || 0;
    const total = sectionData.totalPoints || 0;
    const percentage = total > 0 ? (earned / total) * 100 : 0;
    
    // Count correct/incorrect for this section
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    
    if (sectionData.questions) {
      sectionData.questions.forEach(q => {
        if (q.isCorrect === true) correct++;
        else if (q.isCorrect === false) incorrect++;
        else if (q.pointsEarned === 0 && (!q.studentAnswer || q.studentAnswer === '')) unanswered++;
        else incorrect++; // Partial credit or wrong
      });
    }

    sections.push({
      id: sectionId,
      name: sectionInfo.name,
      subtitle: sectionInfo.subtitle,
      calculatorRequired: sectionInfo.calculatorRequired,
      earned,
      total,
      percentage,
      correct,
      incorrect,
      unanswered,
      questions: sectionData.questions || []
    });

    totalEarned += earned;
    totalPoints += total;
  });

  // Aggregate by question type
  const multipleChoice = {
    earned: (scoreBreakdown.multipleChoice?.earned || 0),
    total: (scoreBreakdown.multipleChoice?.total || 0),
    count: (scoreBreakdown.multipleChoice?.count || 0),
    percentage: 0
  };
  
  const freeResponse = {
    earned: (scoreBreakdown.freeResponse?.earned || 0),
    total: (scoreBreakdown.freeResponse?.total || 0),
    count: (scoreBreakdown.freeResponse?.count || 0),
    percentage: 0
  };

  multipleChoice.percentage = multipleChoice.total > 0 ? (multipleChoice.earned / multipleChoice.total) * 100 : 0;
  freeResponse.percentage = freeResponse.total > 0 ? (freeResponse.earned / freeResponse.total) * 100 : 0;

  return {
    sections,
    multipleChoice,
    freeResponse,
    overall: {
      earned: totalEarned,
      total: totalPoints,
      percentage: totalPoints > 0 ? (totalEarned / totalPoints) * 100 : 0
    }
  };
}

// Helper function to get section information
function getSectionInfo(sectionId, isAPPrecalculus) {
  const sectionMap = {
    'mc-part-a': {
      name: 'Section I, Part A: Multiple Choice',
      subtitle: 'No Calculator',
      calculatorRequired: false
    },
    'mc-part-b': {
      name: 'Section I, Part B: Multiple Choice', 
      subtitle: 'Graphing Calculator Required',
      calculatorRequired: true
    },
    'fr-part-a': {
      name: 'Section II, Part A: Free Response',
      subtitle: 'Graphing Calculator Required', 
      calculatorRequired: true
    },
    'fr-part-b': {
      name: 'Section II, Part B: Free Response',
      subtitle: 'No Calculator',
      calculatorRequired: false
    }
  };

  return sectionMap[sectionId] || {
    name: sectionId,
    subtitle: 'Unknown Section',
    calculatorRequired: false
  };
}

// Helper function to generate type-based recommendations
function generateTypeBasedRecommendations(data) {
  const recommendations = [];
  const mcPerf = data.multipleChoice.percentage;
  const frPerf = data.freeResponse.percentage;
  
  if (mcPerf < 60) {
    recommendations.push("Practice multiple choice test-taking strategies and time management");
  }
  
  if (frPerf < 60) {
    recommendations.push("Focus on showing complete work and clear explanations in free response questions");
  }
  
  if (Math.abs(mcPerf - frPerf) > 20) {
    if (mcPerf > frPerf) {
      recommendations.push("Strengthen written communication and problem-solving documentation skills");
    } else {
      recommendations.push("Practice quick problem recognition and elimination strategies");
    }
  }
  
  if (data.overall.percentage < 70) {
    recommendations.push("Review fundamental concepts and practice with similar problems");
  }

  return recommendations;
}
