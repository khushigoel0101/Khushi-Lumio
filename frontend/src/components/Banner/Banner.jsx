import React from 'react';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-linear-to-br from-white via-indigo-50 to-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          {/* Tag */}
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <span>🔗</span>
            <p className="text-sm">AI-powered Meeting Assistant</p>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Turn Meetings into{" "}
            <span className="text-amber-700">Actionable Insights</span>
          </h1>

          {/* Description */}
          <p className="text-gray-500 mt-4 text-lg">
            Upload transcripts, extract summaries, track action items,
            and never miss important decisions again.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate("/login")}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          </div>


        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex justify-center">

          {/* Glow effect */}
          <div className="absolute w-72 h-72 bg-amber-200 rounded-full blur-3xl opacity-40"></div>

          {/* Image */}
          <img
            src="https://illustrations.popsy.co/gray/work-from-home.svg"
            alt="meeting assistant"
            className="relative w-full max-w-md"
          />
        </div>

      </div>
    </section>
  );
};

export default Banner;