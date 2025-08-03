import { FaInstagram, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#10101a] text-gray-300 py-10 mt-20 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
            <li><Link href="/materials" className="hover:text-blue-400">Materials</Link></li>
          </ul>
        </div>
        {/* Site Founders */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Site Founders</h3>
          <ul className="space-y-2">
            <li>Pratham Khurana <FaInstagram className="inline ml-1 text-pink-500" /></li>
            <li>Shlok Arya <FaInstagram className="inline ml-1 text-pink-500" /></li>
          </ul>
        </div>
        {/* Connect With Me */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Connect With Me</h3>
          <div className="flex space-x-4 text-2xl">
            <a href="#" className="hover:text-blue-400"><FaGithub /></a>
            <a href="#" className="hover:text-blue-400"><FaLinkedin /></a>
            <a href="#" className="hover:text-blue-400"><FaEnvelope /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-8">
        © 2025 Pratham Khurana. All Rights Reserved.
      </div>
    </footer>
  );
}