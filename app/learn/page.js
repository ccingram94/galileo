import Link from 'next/link';
import Image from 'next/image';

export default function LearnResources() {
  // Resource categories for the filtering tabs
  const categories = [
    { id: "all", name: "All Resources" },
    { id: "physics", name: "Physics" },
    { id: "math", name: "Mathematics" },
    { id: "study", name: "Study Skills" },
    { id: "tools", name: "Interactive Tools" }
  ];

  // Featured resources for the showcase section
  const featuredResources = [
    {
      title: "AP Physics 1 Formula Sheet",
      description: "Comprehensive formula sheet covering all units of the AP Physics 1 curriculum, including the new Fluids section.",
      image: "/resources/physics-formulas-thumb.jpg",
      category: "physics",
      type: "PDF",
      link: "/resources/ap-physics-1-formula-sheet.pdf"
    },
    {
      title: "Physics Problem-Solving Framework",
      description: "Step-by-step approach to solving any physics problem, with examples from kinematics, dynamics, and energy.",
      image: "/resources/problem-solving-thumb.jpg",
      category: "physics",
      type: "PDF",
      link: "/resources/physics-problem-solving-framework.pdf"
    },
    {
      title: "Mathematics for Physics Reference",
      description: "Essential math concepts needed for AP Physics success, including algebra, trigonometry, and basic calculus operations.",
      image: "/resources/math-physics-thumb.jpg",
      category: "math",
      type: "PDF",
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
      link: "/learn/concepts/rotational-inertia"
    },
    {
      title: "The Meaning of Conservation Laws in Physics",
      description: "How conservation of energy, momentum, and angular momentum provide powerful problem-solving tools.",
      link: "/learn/concepts/conservation-laws"
    },
    {
      title: "Decoding Free Body Diagrams",
      description: "Master the essential skill of creating and interpreting free body diagrams for dynamics problems.",
      link: "/learn/concepts/free-body-diagrams"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-base-100 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">Free Learning Resources</h1>
              <p className="text-lg mb-6">
                Explore our collection of carefully curated resources to support your journey in physics and mathematics. 
                Whether you're preparing for the AP exam or simply pursuing knowledge, these tools can help you succeed.
              </p>
              <div className="flex gap-4 flex-wrap">
                <a href="#resources" className="btn btn-primary">Browse Resources</a>
                <Link href="/contact" className="btn btn-outline">Request Resource</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/learning-resources-hero.svg" 
                  alt="Learning resources illustration" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Downloads */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Resources</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Download these exclusive Galileo Academics materials to enhance your study sessions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResources.map((resource, index) => (
              <div key={index} className="card bg-base-100 shadow-md hover:shadow-lg transition-all h-full">
                <figure className="px-6 pt-6">
                  <Image 
                    src={resource.image} 
                    alt={resource.title} 
                    width={300}
                    height={200}
                    className="rounded-lg object-cover h-48 w-full"
                  />
                </figure>
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h3 className="card-title">{resource.title}</h3>
                    <div className="badge badge-primary">{resource.type}</div>
                  </div>
                  <p>{resource.description}</p>
                  <div className="card-actions justify-end mt-auto">
                    <a href={resource.link} className="btn btn-primary btn-sm" download>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Online Resources */}
      <section id="resources" className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Online Learning Resources</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              A carefully curated collection of the best free online resources for physics and mathematics.
            </p>
          </div>
          
          {/* Category Tabs */}
          <div className="tabs tabs-boxed justify-center mb-8">
            {categories.map((category, index) => (
              <a key={index} className={`tab ${index === 0 ? 'tab-active' : ''}`}>
                {category.name}
              </a>
            ))}
          </div>
          
          {/* Resources Table */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {onlineResources.map((resource, index) => (
                  <tr key={index}>
                    <td>
                      <div className="font-bold">{resource.title}</div>
                      <div className="text-sm opacity-70">{resource.description}</div>
                    </td>
                    <td>
                      <div className="badge badge-outline">
                        {resource.category === "physics" && "Physics"}
                        {resource.category === "math" && "Mathematics"}
                        {resource.category === "study" && "Study Skills"}
                        {resource.category === "tools" && "Interactive Tool"}
                      </div>
                    </td>
                    <td>{resource.type}</td>
                    <td>{resource.difficulty}</td>
                    <td>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Physics Concept of the Week */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Physics Concept Explanations</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Clear explanations of commonly misunderstood physics concepts, written by our expert instructor.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {conceptExplanations.map((concept, index) => (
              <div key={index} className="card bg-base-100 shadow-md hover:shadow-lg transition-all">
                <div className="card-body">
                  <h3 className="card-title">{concept.title}</h3>
                  <p>{concept.description}</p>
                  <div className="card-actions justify-end">
                    <Link href={concept.link} className="btn btn-primary btn-sm">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Tips */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Physics Study Tips</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Strategies to help you study more effectively and prepare for your exams.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-primary">Mastering Problem-Solving</h3>
                <ol className="space-y-2 mt-4 list-decimal list-inside">
                  <li>Read the problem carefully and identify what you're being asked to find</li>
                  <li>List all given information and convert units if necessary</li>
                  <li>Draw a diagram or visual representation whenever possible</li>
                  <li>Identify the physics principles and equations that apply</li>
                  <li>Work through the mathematics step by step</li>
                  <li>Check your answer: Is the magnitude reasonable? Are the units correct?</li>
                </ol>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-primary">Effective Equation Memorization</h3>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Understand, don't just memorize</strong> - Know what each variable represents and why the equation works</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Group related equations</strong> - Organize formulas by topic (kinematics, dynamics, energy, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Practice derivations</strong> - Being able to derive equations helps you understand their origin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Create flashcards</strong> - Use spaced repetition with Anki or physical flashcards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Create mnemonic devices</strong> - Memory aids can help recall complex formula structures</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-primary">AP Physics Exam Preparation</h3>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Start early</strong> - Begin focused review at least 8 weeks before the exam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Take full practice tests</strong> - Simulate exam conditions with timed practice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Review scoring guidelines</strong> - Understand how the AP exam is graded</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Focus on weak areas</strong> - Target your study on topics you find most challenging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Create a study schedule</strong> - Allocate specific time for each unit based on its weight in the exam</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-primary">Effective Study Habits</h3>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Use the Pomodoro technique</strong> - Study in focused 25-minute intervals with short breaks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Practice active recall</strong> - Test yourself rather than passively re-reading material</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Teach the material</strong> - Explaining concepts to others reinforces your understanding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Use spaced repetition</strong> - Review material at increasing intervals over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Create a distraction-free environment</strong> - Put away your phone and block distracting websites</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Request Resources */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl">Need a Specific Resource?</h3>
              <p className="text-lg">
                If you're looking for a specific topic or type of resource that isn't listed here, let me know. I'm constantly expanding this collection based on student needs.
              </p>
              <div className="card-actions justify-end mt-4">
                <Link href="/contact" className="btn btn-primary">
                  Request Resource
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Personalized Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            While these free resources are helpful, nothing compares to personalized instruction tailored to your specific needs and learning style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tutoring" className="btn btn-secondary">
              Explore Tutoring Options
            </Link>
            <Link href="/contact" className="btn bg-white text-primary hover:bg-base-200">
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
