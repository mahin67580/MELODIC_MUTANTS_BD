import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Melodic Mutant</h2>
            <p className="text-gray-200">
              Transforming music education with expert instructors and innovative technology.
              Learn anytime, anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
              <li><Link href="/about" className="hover:text-gray-300">About Us</Link></li>
              <li><Link href="/courses" className="hover:text-gray-300">Courses</Link></li>
              <li><Link href="/contact" className="hover:text-gray-300">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="hover:text-gray-300">FAQs</Link></li>
              <li><Link href="/help" className="hover:text-gray-300">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gray-300">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
            <p className="flex items-center gap-3"><FaEnvelope /> support@melodicmutant.com</p>
            <p className="flex items-center gap-3 mt-2"><FaPhone /> +1 (234) 567-890</p>
            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <Link href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"><FaFacebookF /></Link>
              <Link href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"><FaTwitter /></Link>
              <Link href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"><FaInstagram /></Link>
              <Link href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"><FaYoutube /></Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-10 pt-6 text-center text-gray-200">
          <p>© {new Date().getFullYear()} Melodic Mutant Music Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
