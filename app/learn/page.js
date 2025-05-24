'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function LearnResources() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Resource categories for the filtering tabs
  const categories = [
    { id: "all", name: "All Resources", icon: "📚" },
    { id: "physics", name: "Physics", icon: "⚛️" },
    { id: "math", name: "Mathematics", icon: "🧮" },
    { id: "study", name: "Study Skills", icon: "🎯" },
    { id: "tools", name: "Interactive Tools", icon: "🔬" }
  ];

  // Featured resources for the showcase section
  const featuredResources = [
    {
      title: "AP Physics 1 Formula Sheet",
      description: "Comprehensive formula sheet covering all units of the AP Physics 1 curriculum, including the new Fluids section.",
      image: "/resources/physics-formulas-thumb.jpg",
      category: "physics",
      type: "PDF",
      icon: "📋",
      link: "/resources/ap-physics-1-formula-sheet.pdf"
    },
    {
      title: "Physics Problem-Solving Framework",
      description: "Step-by-step approach to solving any physics problem, with examples from kinematics, dynamics, and energy.",
      image: "/resources/problem-solving-thumb.jpg",
      category: "physics",
      type: "PDF",
      icon: "🔍",
      link: "/resources/physics-problem-solving-framework.pdf"
    },
    {
      title: "Mathematics for Physics Reference",
      description: "Essential math concepts needed for AP Physics success, including algebra, trigonometry, and basic calculus operations.",
      image: "/resources/math-physics-thumb.jpg",
      category: "math",
      type: "PDF",
      icon: "📐",
      link: "/resources/math-for-physics-reference.pdf"
    }
  ];

  // Online learning resources (videos, websites, etc.)
  const onlineResources = [
    {
      title: "PhET Interactive Simulations",
      description: "Free interactive simulations for physics concepts from the University of Colorado Boulder.",
      category: "physics",
      type: "Interactive",
      difficulty: "All Levels",
      link: "https://phet.colorado.edu/en/simulations/filter?subjects=physics&levels=high-school&type=html"
    },
    {
      title: "Khan Academy - AP Physics 1",
      description: "Free video lessons and practice problems covering the full AP Physics 1 curriculum.",
      category: "physics",
      type: "Video & Practice",
      difficulty: "High School",
      link: "https://www.khanacademy.org/science/ap-physics-1"
    },
    {
      title: "The Physics Classroom",
      description: "Clear, accessible explanations of physics concepts with animations and practice problems.",
      category: "physics",
      type: "Text & Interactive",
      difficulty: "High School",
      link: "https://www.physicsclassroom.com/"
    },
    {
      title: "Desmos Scientific Calculator",
      description: "Free online scientific calculator for solving physics and math problems.",
      category: "tools",
      type: "Calculator",
      difficulty: "All Levels",
      link: "https://www.desmos.com/scientific"
    },
    {
      title: "Desmos Graphing Calculator",
      description: "Powerful graphing calculator for visualizing functions and data.",
      category: "tools",
      type: "Calculator",
      difficulty: "All Levels",
      link: "https://www.desmos.com/calculator"
    },
    {
      title: "Paul's Online Math Notes",
      description: "Comprehensive notes covering algebra, calculus, and differential equations.",
      category: "math",
      type: "Text",
      difficulty: "High School / College",
      link: "https://tutorial.math.lamar.edu/"
    },
    {
      title: "MIT OpenCourseWare - Physics",
      description: "Free lecture notes, videos, and assignments from MIT physics courses.",
      category: "physics",
      type: "Course Materials",
      difficulty: "Advanced",
      link: "https://ocw.mit.edu/search/?d=Physics"
    },
    {
      title: "3Blue1Brown",
      description: "Beautiful visual explanations of math and physics concepts on YouTube.",
      category: "math",
      type: "Video",
      difficulty: "All Levels",
      link: "https://www.youtube.com/c/3blue1brown"
    },
    {
      title: "The Organic Chemistry Tutor - Physics Playlist",
      description: "Clear, step-by-step solutions to physics problems covering all major topics.",
      category: "physics",
      type: "Video",
      difficulty: "High School / College",
      link: "https://www.youtube.com/playlist?list=PL0o_zxa4K1BU6wPPLDsoTj1_wEf0LSNeR"
    },
    {
      title: "Pomodoro Timer for Study Sessions",
      description: "Simple timer implementing the Pomodoro technique for effective studying.",
      category: "study",
      type: "Tool",
      difficulty: "All Levels",
      link: "https://pomofocus.io/"
    },
    {
      title: "Anki Flashcards",
      description: "Powerful spaced repetition flashcard system ideal for memorizing physics formulas and concepts.",
      category: "study",
      type: "Application",
      difficulty: "All Levels",
      link: "https://apps.ankiweb.net/"
    },
    {
      title: "Wolfram Alpha",
      description: "Computational intelligence engine that can solve physics problems and show step-by-step solutions.",
      category: "tools",
      type: "Calculator",
      difficulty: "All Levels",
      link: "https://www.wolframalpha.com/"
    }
  ];

  // Physics concept explanations (original content)
  const conceptExplanations = [
    {
      title: "Understanding Rotational Inertia",
      description: "Learn how mass distribution affects an object's resistance to rotational acceleration.",
      icon: "🔄",
      color: "from-primary/20 to-primary/10",
      link: "/learn/concepts/rotational-inertia"
    },
    {
      title: "The Meaning of Conservation Laws in Physics",
      description: "How conservation of energy, momentum, and angular momentum provide powerful problem-solving tools.",
      icon: "⚖️",
      color: "from-secondary/20 to-secondary/10",
      link: "/learn/concepts/conservation-laws"
    },
    {
      title: "Decoding Free Body Diagrams",
      description: "Master the essential skill of creating and interpreting free body diagrams for dynamics problems.",
      icon: "📊",
      color: "from-accent/20 to-accent/10",
      link: "/learn/concepts/free-body-diagrams"
    }
  ];

  // Study tips data
  const studyTips = [
    {
      title: "Mastering Problem-Solving",
      icon: "🧩",
      color: "from-primary/20 to-primary/10",
      tips: [
        "Read the problem carefully and identify what you're being asked to find",
        "List all given information and convert units if necessary",
        "Draw a diagram or visual representation whenever possible",
        "Identify the physics principles and equations that apply",
        "Work through the mathematics step by step",
        "Check your answer: Is the magnitude reasonable? Are the units correct?"
      ]
    },
    {
      title: "Effective Equation Memorization",
      icon: "📝",
      color: "from-secondary/20 to-secondary/10",
      tips: [
        "Understand, don't just memorize - Know what each variable represents and why the equation works",
        "Group related equations - Organize formulas by topic (kinematics, dynamics, energy, etc.)",
        "Practice derivations - Being able to derive equations helps you understand their origin",
        "Create flashcards - Use spaced repetition with Anki or physical flashcards",
        "Create mnemonic devices - Memory aids can help recall complex formula structures"
      ]
    },
    {
      title: "AP Physics Exam Preparation",
      icon: "📋",
      color: "from-accent/20 to-accent/10",
      tips: [
        "Start early - Begin focused review at least 8 weeks before the exam",
        "Take full practice tests - Simulate exam conditions with timed practice",
        "Review scoring guidelines - Understand how the AP exam is graded",
        "Focus on weak areas - Target your study on topics you find most challenging",
        "Create a study schedule - Allocate specific time for each unit based on its weight in the exam"
      ]
    },
    {
      title: "Effective Study Habits",
      icon: "⏰",
      color: "from-primary/20 to-primary/10",
      tips: [
        "Use the Pomodoro technique - Study in focused 25-minute intervals with short breaks",
        "Practice active recall - Test yourself rather than passively re-reading material",
        "Teach the material - Explaining concepts to others reinforces your understanding",
        "Use spaced repetition - Review material at increasing intervals over time",
        "Create a distraction-free environment - Put away your phone and block distracting websites"
      ]
    }
  ];

  // Filter resources based on active category
  const filteredResources = activeCategory === 'all' 
    ? onlineResources 
    : onlineResources.filter(resource => resource.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced with better visual hierarchy */}
      <section className="relative bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-7xl px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-6">
              <div className="badge badge-outline badge-lg text-primary border-primary/30">
                Free Educational Resources
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Free Learning
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                  Resources
                </span>
              </h1>
              <p className="text-xl text-base-content/80 leading-relaxed max-w-lg">
                Explore our collection of carefully curated resources to support your journey in physics and mathematics. Whether you're preparing for the AP exam or simply pursuing knowledge, these tools can help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#resources" className="btn btn-primary btn-lg shadow-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Browse Resources
                </a>
                <Link href="/contact" className="btn btn-outline btn-lg hover:btn-primary">
                  Request Resource
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative w-96 h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/about-hero.jpg" 
                    alt="Free learning resources and study materials" 
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Downloads */}
      <section className="py-20 bg-gradient-to-br from-base-200 via-base-200 to-base-300/50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-primary badge-lg mb-4">Exclusive Content</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Featured Resources</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Download these exclusive Galileo Academics materials to enhance your study sessions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {featuredResources.map((resource, index) => (
              <div key={index} className="group">
                <div className="card bg-base-100 shadow-xl border border-base-300/30 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <figure className="px-6 pt-6">
                    <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                      <span className="text-6xl opacity-70">{resource.icon}</span>
                    </div>
                  </figure>
                  <div className="card-body p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{resource.title}</h3>
                      <div className="badge badge-primary">{resource.type}</div>
                    </div>
                    <p className="text-base-content/80 leading-relaxed mb-6">{resource.description}</p>
                    <div className="mt-auto">
                      <a href={resource.link} className="btn btn-primary w-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" download>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Online Resources */}
      <section id="resources" className="py-20 bg-base-100">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-secondary badge-lg mb-4">Curated Collection</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Online Learning Resources</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              A carefully curated collection of the best free online resources for physics and mathematics.
            </p>
          </div>
          
          {/* Enhanced Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`btn btn-lg ${
                  activeCategory === category.id 
                    ? 'btn-primary shadow-lg' 
                    : 'btn-outline hover:btn-primary'
                }`}
              >
                <span className="text-lg mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Enhanced Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredResources.map((resource, index) => (
              <div key={index} className="group">
                <div className="card bg-base-100 shadow-lg border border-base-300/30 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="card-body p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{resource.title}</h3>
                        <p className="text-sm text-base-content/70 leading-relaxed mb-3">{resource.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="badge badge-outline">
                        {resource.category === "physics" && "⚛️ Physics"}
                        {resource.category === "math" && "🧮 Mathematics"}
                        {resource.category === "study" && "🎯 Study Skills"}
                        {resource.category === "tools" && "🔬 Interactive Tool"}
                      </div>
                      <div className="badge badge-secondary badge-outline">{resource.type}</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-base-content/60">{resource.difficulty}</span>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer" 
                         className="btn btn-primary btn-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Physics Concept Explanations */}
      <section className="py-20 bg-gradient-to-br from-base-200 via-base-200 to-base-300/50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-accent badge-lg mb-4">Expert Content</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Physics Concept Explanations</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Clear explanations of commonly misunderstood physics concepts, written by our expert instructor.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {conceptExplanations.map((concept, index) => (
              <div key={index} className="group">
                <div className="card bg-base-100 shadow-xl border border-base-300/30 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="card-body p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${concept.color} flex items-center justify-center text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {concept.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{concept.title}</h3>
                    <p className="text-base-content/70 leading-relaxed mb-6">{concept.description}</p>
                    <div className="mt-auto">
                      <Link href={concept.link} className="btn btn-primary btn-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Study Tips */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-primary badge-lg mb-4">Study Strategies</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Physics Study Tips</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Strategies to help you study more effectively and prepare for your exams.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {studyTips.map((tip, index) => (
              <div key={index} className="group">
                <div className="card bg-base-100 shadow-xl border border-base-300/30 h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="card-body p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}>
                        {tip.icon}
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{tip.title}</h3>
                    </div>
                    
                    <ul className="space-y-3">
                      {tip.tips.map((tipItem, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-success shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm leading-relaxed">
                            <strong>{tipItem.split(' - ')[0]}</strong>
                            {tipItem.includes(' - ') && (
                              <span className="text-base-content/70"> - {tipItem.split(' - ')[1]}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Request Resources */}
      <section className="py-20 bg-gradient-to-br from-base-200 via-base-200 to-base-300/50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border border-base-300/50">
            <div className="card-body p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl mx-auto mb-6">
                💡
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Need a Specific Resource?</h3>
              <p className="text-lg text-base-content/80 leading-relaxed mb-8 max-w-2xl mx-auto">
                If you're looking for a specific topic or type of resource that isn't listed here, let me know. I'm constantly expanding this collection based on student needs.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Request Resource
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-secondary text-primary-content relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-7xl px-6 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="badge badge-outline badge-lg text-primary-content border-primary-content/30 mb-6">
              Take the Next Step
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
              Ready for 
              <span className="block">Personalized Learning?</span>
            </h2>
            <p className="text-xl mb-12 text-primary-content/90 leading-relaxed max-w-3xl mx-auto">
              While these free resources are helpful, nothing compares to personalized instruction tailored to your specific needs and learning style.
            </p>
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
              <Link href="/tutoring" className="btn btn-secondary btn-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Explore Tutoring Options
              </Link>
              <Link href="/contact" className="btn bg-white/20 backdrop-blur-sm text-primary-content border-white/30 hover:bg-white hover:text-primary btn-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
