import React from 'react';

interface NavbarProps {
  currentPage: 'home' | 'data';
  onPageChange: (page: 'home' | 'data') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      {/* Main Navbar Container */}
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onPageChange('home')}>
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-2.5 rounded-lg shadow-md">
              <i className="fas fa-microchip text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">SQL Visualizer</h1>
              <p className="text-xs text-slate-500 font-medium">Giải thích các bước thực thi SQL</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Center */}
        <div className="hidden sm:flex items-center space-x-1">
          <button
            onClick={() => onPageChange('home')}
            className={`relative px-6 py-2 font-semibold text-sm transition-all group ${
              currentPage === 'home'
                ? 'text-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <i className={`fas fa-home text-base ${currentPage === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}></i>
              <span>Trang chủ</span>
            </div>
            {currentPage === 'home' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-full"></div>
            )}
          </button>

          <button
            onClick={() => onPageChange('data')}
            className={`relative px-6 py-2 font-semibold text-sm transition-all group ${
              currentPage === 'data'
                ? 'text-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <i className={`fas fa-database text-base ${currentPage === 'data' ? 'text-indigo-600' : 'text-slate-400'}`}></i>
              <span>Dữ liệu</span>
            </div>
            {currentPage === 'data' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-full"></div>
            )}
          </button>
        </div>

        {/* Right Section - Social Links */}
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-600 transition-colors hover:scale-110 transform duration-200"
            title="GitHub"
          >
            <i className="fab fa-github text-xl"></i>
          </a>
        </div>

        {/* Mobile Menu Button - Hidden on larger screens */}
        <div className="sm:hidden flex items-center space-x-2">
          <button
            onClick={() => onPageChange('home')}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === 'home'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Trang chủ"
          >
            <i className="fas fa-home text-lg"></i>
          </button>
          <button
            onClick={() => onPageChange('data')}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === 'data'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Dữ liệu"
          >
            <i className="fas fa-database text-lg"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

