import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-amber-100 text-amber-900 border-t border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-sm">© 2026 AI Notes. All rights reserved.</p>
        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="hover:text-amber-800 transition">Home</a>
          <a href="#" className="hover:text-amber-800 transition">Profile</a>
          <a href="#" className="hover:text-amber-800 transition">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;