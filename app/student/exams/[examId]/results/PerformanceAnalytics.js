'use client';

import { useState } from 'react';

export default function PerformanceAnalytics({ 
  currentAttempt, 
  allAttempts = [], 
  examStats = {}, 
  performanceData = {} 
}) {
  const [activeTab, setActiveTab] = useState('progress'); // 'progress', 'comparison', 'insights'

  // Calculate analytics data
  const analytics = calculateAnalytics(currentAttempt, allAttempts, examStats, performanceData);

  return (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-base-300">
        <h3 className="font-bold flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Performance Analytics
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pt-3">
        <div className="tabs tabs-bordered">
          <button 
            className={`tab ${activeTab === 'progress' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Progress
          </button>
          <button 
            className={`tab ${activeTab === 'comparison' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            Comparison
          </button>
          <button 
            className={`tab ${activeTab === 'insights' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            Insights
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'progress' && <ProgressView analytics={analytics} />}
        {activeTab === 'comparison' && <ComparisonView analytics={analytics} />}
        {activeTab === 'insights' && <InsightsView analytics={analytics} />}
      </div>
    </div>
  );
}

// Progress tracking view
function ProgressView({ analytics }) {
  return (
    <div className="space-y-6">
      {/* Attempt History */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Attempt Progress
        </h4>
        
        {analytics.attemptHistory.length > 1 ? (
          <div className="space-y-3">
            {/* Progress Chart */}
            <div className="bg-base-50 border border-base-300 rounded-lg p-4">
              <div className="flex items-end justify-between h-32">
                {analytics.attemptHistory.map((attempt, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full max-w-12 bg-base-300 rounded-t relative">
                      <div 
                        className={`rounded-t transition-all duration-700 ${
                          attempt.score >= 70 ? 'bg-success' :
                          attempt.score >= 50 ? 'bg-warning' : 'bg-error'
                        }`}
                        style={{ 
                          height: `${Math.max(4, (attempt.score / 100) * 120)}px`,
                          marginTop: `${120 - Math.max(4, (attempt.score / 100) * 120)}px`
                        }}
                      ></div>
                      {index === analytics.attemptHistory.length - 1 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                          <div className="badge badge-primary badge-xs">Current</div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-center">
                      <div className="font-medium">{Math.round(attempt.score)}%</div>
                      <div className="text-base-content/60">#{index + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="stat bg-base-50 border border-base-300 rounded-lg">
                <div className="stat-title text-xs">Score Change</div>
                <div className={`stat-value text-lg ${
                  analytics.scoreImprovement > 0 ? 'text-success' : 
                  analytics.scoreImprovement < 0 ? 'text-error' : 'text-base-content'
                }`}>
                  {analytics.scoreImprovement > 0 ? '+' : ''}{analytics.scoreImprovement.toFixed(1)}%
                </div>
              </div>
              
              <div className="stat bg-base-50 border border-base-300 rounded-lg">
                <div className="stat-title text-xs">Best Score</div>
                <div className="stat-value text-lg text-success">
                  {Math.round(analytics.bestScore)}%
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-base-content/50">
            <svg className="w-8 h-8 mx-auto mb-2 text-base-content/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">This is your first attempt</p>
            <p className="text-xs text-base-content/40">Take more attempts to see progress trends</p>
          </div>
        )}
      </div>

      {/* Time Management */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Time Management
        </h4>
        
        <div className="bg-base-50 border border-base-300 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-base-content/60">Time Used:</span>
              <div className="font-medium">{analytics.timeUsed} minutes</div>
            </div>
            <div>
              <span className="text-base-content/60">Time Limit:</span>  
              <div className="font-medium">{analytics.timeLimit} minutes</div>
            </div>
            <div>
              <span className="text-base-content/60">Efficiency:</span>
              <div className={`font-medium ${
                analytics.timeEfficiency >= 0.8 ? 'text-success' :
                analytics.timeEfficiency >= 0.6 ? 'text-warning' : 'text-error'
              }`}>
                {analytics.timeEfficiency >= 0.8 ? 'Excellent' :
                 analytics.timeEfficiency >= 0.6 ? 'Good' : 'Needs Work'}
              </div>
            </div>
            <div>
              <span className="text-base-content/60">Pace:</span>
              <div className="font-medium">
                {analytics.averageTimePerQuestion.toFixed(1)} min/question
              </div>
            </div>
          </div>
          
          {/* Time Usage Bar */}
          <div className="mt-3">
            <div className="w-full bg-base-300 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  analytics.timeUsed <= analytics.timeLimit * 0.8 ? 'bg-success' :
                  analytics.timeUsed <= analytics.timeLimit ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${Math.min(100, (analytics.timeUsed / analytics.timeLimit) * 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-base-content/60 mt-1">
              {((analytics.timeUsed / analytics.timeLimit) * 100).toFixed(1)}% of allowed time
            </div>
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div>
        <h4 className="font-semibold mb-3">Performance Areas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-success/5 border border-success/20 rounded-lg p-3">
            <h5 className="font-medium text-success text-sm mb-2">Strengths</h5>
            <ul className="text-sm space-y-1">
              {analytics.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-success/80">
                  <span className="text-success mt-0.5">•</span>
                  <span>{strength}</span>
                </li>
              ))}
              {analytics.strengths.length === 0 && (
                <li className="text-success/60 italic">Keep working to identify strengths</li>
              )}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
            <h5 className="font-medium text-warning text-sm mb-2">Areas for Improvement</h5>
            <ul className="text-sm space-y-1">
              {analytics.improvementAreas.map((area, index) => (
                <li key={index} className="flex items-start gap-2 text-warning/80">
                  <span className="text-warning mt-0.5">•</span>
                  <span>{area}</span>
                </li>
              ))}
              {analytics.improvementAreas.length === 0 && (
                <li className="text-warning/60 italic">Great job! Keep up the excellent work</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Class comparison view
function ComparisonView({ analytics }) {
  return (
    <div className="space-y-6">
      {/* Class Performance Comparison */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Class Comparison
        </h4>

        <div className="space-y-4">
          {/* Performance Rank */}
          <div className="bg-base-50 border border-base-300 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-secondary">{analytics.classRank}</div>
                <div className="text-sm text-base-content/60">Class Rank</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{analytics.percentile}%</div>
                <div className="text-sm text-base-content/60">Percentile</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{Math.round(analytics.classAverage)}%</div>
                <div className="text-sm text-base-content/60">Class Average</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  analytics.aboveAverage ? 'text-success' : 'text-warning'
                }`}>
                  {analytics.aboveAverage ? '+' : ''}{(analytics.currentScore - analytics.classAverage).toFixed(1)}%
                </div>
                <div className="text-sm text-base-content/60">
                  {analytics.aboveAverage ? 'Above' : 'Below'} Average
                </div>
              </div>
            </div>
          </div>

          {/* Score Distribution */}
          <div className="bg-base-50 border border-base-300 rounded-lg p-4">
            <h5 className="font-medium mb-3">Score Distribution</h5>
            <div className="space-y-2">
              {analytics.scoreDistribution.map((bracket, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-base-content/60">
                    {bracket.range}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-base-300 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          bracket.current ? 'bg-primary' : 'bg-base-content/20'
                        }`}
                        style={{ width: `${bracket.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-right">
                    {bracket.count} {bracket.current && '(You)'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Time Comparison */}
      <div>
        <h4 className="font-semibold mb-3">Time Comparison</h4>
        <div className="bg-base-50 border border-base-300 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-medium">{analytics.timeUsed} min</div>
              <div className="text-base-content/60">Your Time</div>
            </div>
            <div>
              <div className="font-medium">{Math.round(analytics.averageTime)} min</div>
              <div className="text-base-content/60">Class Average</div>
            </div>
            <div>
              <div className={`font-medium ${
                analytics.timeUsed <= analytics.averageTime ? 'text-success' : 'text-warning'
              }`}>
                {analytics.timeUsed <= analytics.averageTime ? 'Faster' : 'Slower'}
              </div>
              <div className="text-base-content/60">
                by {Math.abs(analytics.timeUsed - analytics.averageTime).toFixed(0)} min
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      {analytics.achievements.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {analytics.achievements.map((achievement, index) => (
              <div key={index} className={`badge badge-lg gap-2 ${achievement.color || 'badge-primary'}`}>
                <span>{achievement.icon}</span>
                <span>{achievement.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Performance insights view
function InsightsView({ analytics }) {
  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Key Insights
        </h4>

        <div className="space-y-4">
          {analytics.insights.map((insight, index) => (
            <div key={index} className={`border-l-4 pl-4 py-3 ${insight.color || 'border-info'} bg-opacity-5`}>
              <div className="flex items-start gap-3">
                <span className="text-lg">{insight.icon}</span>
                <div>
                  <h5 className="font-medium">{insight.title}</h5>
                  <p className="text-sm text-base-content/70 mt-1">{insight.description}</p>
                  {insight.action && (
                    <p className="text-sm font-medium mt-2 text-info">{insight.action}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Patterns */}
      <div>
        <h4 className="font-semibold mb-3">Performance Patterns</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.patterns.map((pattern, index) => (
            <div key={index} className="bg-base-50 border border-base-300 rounded-lg p-4">
              <h5 className="font-medium text-sm mb-2">{pattern.category}</h5>
              <div className="space-y-2">
                {pattern.observations.map((obs, obsIndex) => (
                  <div key={obsIndex} className="text-sm flex items-start gap-2">
                    <span className={`${pattern.color || 'text-base-content/60'} mt-0.5`}>•</span>
                    <span className="text-base-content/80">{obs}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Recommendations */}
      <div>
        <h4 className="font-semibold mb-3">Personalized Study Plan</h4>
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-4">
          <div className="space-y-3">
            {analytics.studyPlan.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`badge badge-sm ${item.priority === 'high' ? 'badge-error' : item.priority === 'medium' ? 'badge-warning' : 'badge-info'}`}>
                  {item.priority}
                </div>
                <div className="flex-1">
                  <h6 className="font-medium text-sm">{item.topic}</h6>
                  <p className="text-xs text-base-content/70">{item.recommendation}</p>
                  <div className="text-xs text-primary mt-1">{item.timeEstimate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate analytics
function calculateAnalytics(currentAttempt, allAttempts, examStats, performanceData) {
  const currentScore = currentAttempt.score || 0;
  const timeUsed = currentAttempt.timeUsed || 0;
  
  // Calculate attempt history
  const attemptHistory = allAttempts.map(attempt => ({
    score: attempt.score || 0,
    timeUsed: attempt.timeUsed || 0,
    date: attempt.completedAt
  }));

  // Calculate score improvement
  let scoreImprovement = 0;
  if (attemptHistory.length > 1) {
    const previousScore = attemptHistory[attemptHistory.length - 2].score;
    scoreImprovement = currentScore - previousScore;
  }

  const bestScore = Math.max(...attemptHistory.map(a => a.score), 0);

  // Calculate time analytics
  const timeLimit = examStats.timeLimit || 90;
  const timeEfficiency = timeLimit > 0 ? (timeLimit - timeUsed) / timeLimit : 0;
  const totalQuestions = examStats.totalQuestions || 1;
  const averageTimePerQuestion = timeUsed / totalQuestions;

  // Generate strengths and improvement areas
  const { strengths, improvementAreas } = analyzePerformance(currentAttempt, performanceData);

  // Class comparison data
  const classAverage = examStats.avgScore || 70;
  const totalStudents = examStats.totalStudents || 1;
  const classRank = calculateClassRank(currentScore, classAverage, totalStudents);
  const percentile = calculatePercentile(currentScore, classAverage, totalStudents);
  const aboveAverage = currentScore >= classAverage;

  // Generate insights
  const insights = generateInsights(currentAttempt, allAttempts, examStats, performanceData);
  const patterns = analyzePatterns(currentAttempt, performanceData);
  const studyPlan = generateStudyPlan(currentAttempt, performanceData);
  const achievements = calculateAchievements(currentAttempt, allAttempts, examStats);

  return {
    // Progress data
    attemptHistory,
    scoreImprovement,
    bestScore,
    timeUsed,
    timeLimit,
    timeEfficiency,
    averageTimePerQuestion,
    strengths,
    improvementAreas,

    // Comparison data
    currentScore,
    classRank,
    percentile,
    classAverage,
    aboveAverage,
    averageTime: examStats.avgTime || timeUsed,
    scoreDistribution: generateScoreDistribution(currentScore, classAverage, totalStudents),
    achievements,

    // Insights data
    insights,
    patterns,
    studyPlan
  };
}

// Helper functions for analytics calculations
function analyzePerformance(attempt, performanceData) {
  const strengths = [];
  const improvementAreas = [];
  const score = attempt.score || 0;

  if (score >= 85) strengths.push("Excellent overall performance");
  if (score >= 70) strengths.push("Meets passing requirements");
  
  const mcScore = performanceData.questionTypes?.multipleChoice?.earned || 0;
  const mcTotal = performanceData.questionTypes?.multipleChoice?.total || 1;
  const frScore = performanceData.questionTypes?.freeResponse?.earned || 0;
  const frTotal = performanceData.questionTypes?.freeResponse?.total || 1;

  if (mcTotal > 0 && (mcScore/mcTotal) >= 0.8) {
    strengths.push("Strong multiple choice performance");
  }
  if (frTotal > 0 && (frScore/frTotal) >= 0.7) {
    strengths.push("Good free response skills");
  }

  if (score < 70) improvementAreas.push("Overall score below passing threshold");
  if (mcTotal > 0 && (mcScore/mcTotal) < 0.6) {
    improvementAreas.push("Multiple choice strategies need work");
  }
  if (frTotal > 0 && (frScore/frTotal) < 0.6) {
    improvementAreas.push("Free response explanations need improvement");
  }

  return { strengths, improvementAreas };
}

function generateInsights(currentAttempt, allAttempts, examStats, performanceData) {
  const insights = [];
  const score = currentAttempt.score || 0;

  if (score >= 90) {
    insights.push({
      icon: "🎉",
      title: "Excellent Performance",
      description: "You scored in the top tier! Your understanding of the material is strong.",
      action: "Consider helping classmates or exploring advanced topics.",
      color: "border-success"
    });
  }

  if (allAttempts.length > 1) {
    const improvement = score - (allAttempts[allAttempts.length - 2]?.score || 0);
    if (improvement > 10) {
      insights.push({
        icon: "📈",
        title: "Significant Improvement",
        description: `Your score improved by ${improvement.toFixed(1)} points from your previous attempt.`,
        action: "Keep up the great work with your study strategies!",
        color: "border-success"
      });
    }
  }

  if ((currentAttempt.timeUsed || 0) < (examStats.timeLimit || 90) * 0.5) {
    insights.push({
      icon: "⚡",
      title: "Speed Demon",
      description: "You completed the exam very quickly. Consider reviewing your answers.",
      action: "Use remaining time to double-check your work.",
      color: "border-warning"
    });
  }

  return insights;
}

function analyzePatterns(attempt, performanceData) {
  const patterns = [];

  // Question type patterns
  const mcScore = performanceData.questionTypes?.multipleChoice?.earned || 0;
  const mcTotal = performanceData.questionTypes?.multipleChoice?.total || 1;
  const frScore = performanceData.questionTypes?.freeResponse?.earned || 0;
  const frTotal = performanceData.questionTypes?.freeResponse?.total || 1;

  patterns.push({
    category: "Question Types",
    color: "text-primary",
    observations: [
      `Multiple Choice: ${((mcScore/mcTotal) * 100).toFixed(1)}% accuracy`,
      `Free Response: ${((frScore/frTotal) * 100).toFixed(1)}% of points earned`,
      mcScore/mcTotal > frScore/frTotal ? "Stronger with multiple choice" : "Better at free response"
    ]
  });

  return patterns;
}

function generateStudyPlan(attempt, performanceData) {
  const plan = [];
  const score = attempt.score || 0;

  if (score < 70) {
    plan.push({
      priority: "high",
      topic: "Core Concepts Review",
      recommendation: "Focus on fundamental mathematical principles",
      timeEstimate: "2-3 hours per week"
    });
  }

  const mcScore = performanceData.questionTypes?.multipleChoice?.earned || 0;
  const mcTotal = performanceData.questionTypes?.multipleChoice?.total || 1;
  if (mcScore/mcTotal < 0.7) {
    plan.push({
      priority: "medium",
      topic: "Multiple Choice Strategies",
      recommendation: "Practice elimination techniques and time management",
      timeEstimate: "30 minutes daily"
    });
  }

  return plan;
}

function calculateAchievements(currentAttempt, allAttempts, examStats) {
  const achievements = [];
  const score = currentAttempt.score || 0;

  if (score === 100) {
    achievements.push({
      icon: "🏆",
      title: "Perfect Score",
      color: "badge-warning"
    });
  }

  if (score >= 95) {
    achievements.push({
      icon: "⭐",
      title: "Outstanding",
      color: "badge-success"
    });
  }

  if (allAttempts.length > 1 && score > (allAttempts[0]?.score || 0)) {
    achievements.push({
      icon: "📈",
      title: "Improved",
      color: "badge-info"
    });
  }

  return achievements;
}

function calculateClassRank(score, classAverage, totalStudents) {
  // Simplified ranking calculation
  if (score >= classAverage + 15) return Math.ceil(totalStudents * 0.1);
  if (score >= classAverage + 5) return Math.ceil(totalStudents * 0.25);
  if (score >= classAverage) return Math.ceil(totalStudents * 0.5);
  return Math.ceil(totalStudents * 0.75);
}

function calculatePercentile(score, classAverage, totalStudents) {
  if (score >= classAverage + 15) return 90;
  if (score >= classAverage + 5) return 75;
  if (score >= classAverage) return 50;
  if (score >= classAverage - 10) return 25;
  return 10;
}

function generateScoreDistribution(currentScore, classAverage, totalStudents) {
  return [
    { range: "90-100%", percentage: 15, count: Math.ceil(totalStudents * 0.15), current: currentScore >= 90 },
    { range: "80-89%", percentage: 25, count: Math.ceil(totalStudents * 0.25), current: currentScore >= 80 && currentScore < 90 },
    { range: "70-79%", percentage: 30, count: Math.ceil(totalStudents * 0.30), current: currentScore >= 70 && currentScore < 80 },
    { range: "60-69%", percentage: 20, count: Math.ceil(totalStudents * 0.20), current: currentScore >= 60 && currentScore < 70 },
    { range: "Below 60%", percentage: 10, count: Math.ceil(totalStudents * 0.10), current: currentScore < 60 }
  ];
}
