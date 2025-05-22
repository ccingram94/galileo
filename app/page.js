import Hero from "../components/Hero";
import CourseUnitCard from "../components/CourseUnitCard";
import TutoringOption from "../components/TutoringOption";
import AboutInstructor from "../components/AboutInstructor";
import Image from "next/image";
import Link from "next/link";

// Sample data for course units
const courseUnits = [
  {
    number: 1,
    title: "Kinematics",
    topics: ["Motion in One Dimension", "Motion in Two Dimensions", "Projectile Motion"],
    lessons: 5,
    slug: "kinematics"
  },
  {
    number: 2,
    title: "Dynamics",
    topics: ["Newton's Laws of Motion", "Forces", "Friction and Drag"],
    lessons: 5,
    slug: "dynamics"
  },
  {
    number: 3,
    title: "Circular Motion & Gravitation",
    topics: ["Uniform Circular Motion", "Universal Gravitation", "Orbital Motion"],
    lessons: 5,
    slug: "circular-motion"
  },
  {
    number: 7,
    title: "Fluids",
    topics: ["Pressure", "Buoyancy", "Fluid Dynamics"],
    lessons: 5,
    slug: "fluids"
  }
];

// Tutoring options data
const tutoringOptions = [
  {
    title: "One-on-One Tutoring",
    price: 70,
    features: [
      "Private 55-minute Zoom sessions",
      "Personalized curriculum pacing",
      "Homework assistance",
      "Direct access to tutor",
      "Flexible scheduling",
      "Detailed progress reports"
    ],
    primary: true,
    href: "/booking/individual"
  },
  {
    title: "Group Classes",
    price: 30,
    features: [
      "Small groups (4-6 students)",
      "55-minute Zoom sessions",
      "Structured curriculum",
      "Collaborative learning",
      "Affordable rates",
      "Comprehensive unit exams"
    ],
    primary: false,
    href: "/booking/group"
  }
];

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Course Overview Section */}
      <section className="py-16 px-6 bg-base-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">AP Physics 1 Curriculum</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Our curriculum is meticulously aligned with the College Board's updated AP Physics 1 
              exam outline, including the new Fluids unit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseUnits.map((unit) => (
              <CourseUnitCard key={unit.number} {...unit} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/courses" className="btn btn-outline btn-primary">
              View Full Curriculum
            </Link>
          </div>
        </div>
      </section>
      
      {/* Tutoring Options Section */}
      <section className="py-16 px-6 bg-base-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Tutoring Options</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Choose the learning format that best fits your needs and budget.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tutoringOptions.map((option, index) => (
              <TutoringOption key={index} {...option} />
            ))}
          </div>
        </div>
      </section>
      
      {/* About Instructor Section */}
      <AboutInstructor />
      
      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-base-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Student Success Stories</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Hear from students who have achieved excellent results with our tutoring approach.
            </p>
          </div>
          
          <div className="carousel w-full max-w-4xl mx-auto">
            {/* You can expand this with actual testimonials - this is a placeholder */}
            <div className="carousel-item w-full">
              <div className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="avatar placeholder mr-4">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                        <span>JD</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold">Jamie D.</h3>
                      <p className="text-sm">AP Physics 1 Student</p>
                    </div>
                  </div>
                  <p className="italic">
                    "The structured approach and personalized feedback helped me achieve a 5 on the AP exam. 
                    The fluid mechanics section was particularly helpful as it was a challenging topic for me."
                  </p>
                  <div className="flex mt-4">
                    <div className="rating rating-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <input 
                          key={star}
                          type="radio" 
                          name="rating-1" 
                          className="mask mask-star-2 bg-orange-400" 
                          checked={star === 5} 
                          readOnly
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Excel in AP Physics?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our expert-led sessions and build the knowledge and confidence you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-secondary">
              Schedule a Free Consultation
            </Link>
            <Link href="/booking" className="btn bg-white text-primary hover:bg-base-200">
              Book Your First Session
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
