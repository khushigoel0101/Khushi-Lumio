import React from 'react';

const Header = () => {
  return (
    <header className="bg-amber-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-amber-100">Meeting Assistant</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button className="bg-amber-700 text-white hover:bg-amber-600 px-4 py-2 rounded-md text-sm font-medium transition duration-200">
              Join
            </button>
            <button className="border border-amber-200 text-amber-100 hover:bg-amber-800 px-4 py-2 rounded-md text-sm font-medium transition duration-200">
              Login
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-amber-100 hover:text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;