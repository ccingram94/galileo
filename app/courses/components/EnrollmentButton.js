'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EnrollmentButton({ course, user, className = "btn btn-primary" }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEnrollment = async () => {
    if (!user) {
      router.push('/auth/login?callbackUrl=/courses');
      return;
    }

    if (course.isFree) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/enrollments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId: course.id,
          }),
        });

        if (response.ok) {
          router.push(`/dashboard/courses/${course.id}`);
        } else {
          throw new Error('Failed to enroll');
        }
      } catch (error) {
        console.error('Enrollment error:', error);
        alert('Failed to enroll. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Redirect to payment page for paid courses
      router.push(`/checkout/${course.id}`);
    }
  };

  if (!user) {
    return (
      <Link href="/auth/login?callbackUrl=/courses" className={className}>
        Sign In to Enroll
      </Link>
    );
  }

  return (
    <button 
      onClick={handleEnrollment}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'loading' : ''}`}
    >
      {isLoading ? 'Enrolling...' : (course.isFree ? 'Enroll Free' : 'Enroll Now')}
    </button>
  );
}
