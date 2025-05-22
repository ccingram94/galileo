import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content">
      <div>
        <span className="footer-title">Services</span> 
        <Link href="/courses" className="link link-hover">AP Physics 1</Link>
        <Link href="/tutoring/individual" className="link link-hover">One-on-One Tutoring</Link>
        <Link href="/tutoring/group" className="link link-hover">Group Classes</Link>
        <Link href="/resources" className="link link-hover">Study Resources</Link>
      </div> 
      <div>
        <span className="footer-title">Company</span> 
        <Link href="/about" className="link link-hover">About Us</Link>
        <Link href="/contact" className="link link-hover">Contact</Link>
        <Link href="/testimonials" className="link link-hover">Testimonials</Link>
        <Link href="/faq" className="link link-hover">FAQ</Link>
      </div> 
      <div>
        <span className="footer-title">Legal</span> 
        <Link href="/terms" className="link link-hover">Terms of Service</Link>
        <Link href="/privacy" className="link link-hover">Privacy Policy</Link>
      </div>
      <div>
        <span className="footer-title">Newsletter</span> 
        <div className="form-control w-80">
          <label className="label">
            <span className="label-text">Stay updated on AP exam tips</span>
          </label> 
          <div className="relative">
            <input type="email" placeholder="username@site.com" className="input input-bordered w-full pr-16" /> 
            <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">Subscribe</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
