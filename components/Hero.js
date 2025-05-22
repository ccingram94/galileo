import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="hero min-h-[80vh] bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8">
        <Image 
          src="/physics-hero.svg" 
          alt="AP Physics concepts visualization"
          width={500}
          height={500}
          className="max-w-sm rounded-lg shadow-lg"
          priority
        />
        <div>
          <h1 className="text-5xl font-bold text-base-content">
            Mastering the AP Physics 1 Exam
          </h1>
          <p className="py-6 text-lg">
            Expert-led preparation for the updated 2023-2025 AP Physics curriculum. 
            Our meticulous approach covers all units including the new Fluids section, 
            with comprehensive feedback on your progress.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/tutoring/individual" className="btn btn-primary">One-on-One Tutoring</Link>
            <Link href="/tutoring/group" className="btn btn-secondary">Group Classes</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
