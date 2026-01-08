import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

interface NavbarProps {
  currentPage: 'home' | 'data';
  onPageChange: (page: 'home' | 'data') => void;
}

interface FeedbackFormData {
  email: string;
  feedback: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackFormData>({
    email: '',
    feedback: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFeedbackChange = (field: keyof FeedbackFormData, value: string) => {
    setFeedbackData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateAndSubmitFeedback = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    // Validate feedback is not empty
    if (!feedbackData.feedback.trim()) {
      setErrorMessage('Vui lòng nhập lời góp ý');
      return;
    }

    // Validate email format if provided
    if (feedbackData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedbackData.email)) {
      setErrorMessage('Email không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            message: feedbackData.feedback,
            email: feedbackData.email || null
          }
        ]);

      if (error) {
        setErrorMessage('Có lỗi khi gửi góp ý: ' + error.message);
      } else {
        setSuccessMessage('Cảm ơn bạn đã gửi góp ý!');
        setFeedbackData({ email: '', feedback: '' });
        
        setTimeout(() => {
          setShowFeedbackModal(false);
          setSuccessMessage('');
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage('Có lỗi không mong muốn: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
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

          {/* Right Section - Feedback Button + Social Links */}
          <div className="flex items-center space-x-3">
            {/* Feedback Button */}
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              title="Gửi góp ý"
            >
              <i className="fas fa-lightbulb text-base"></i>
              <span>Góp ý</span>
            </button>

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
              onClick={() => setShowFeedbackModal(true)}
              className="p-2 rounded-lg transition-colors text-blue-500 hover:bg-blue-50"
              title="Góp ý"
            >
              <i className="fas fa-lightbulb text-lg"></i>
            </button>
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

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-lightbulb text-white text-lg"></i>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Góp ý</h2>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Success Message */}
              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                  <i className="fas fa-circle-exclamation text-red-500"></i>
                  {errorMessage}
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <i className="fas fa-envelope mr-2"></i>Email <span className="text-slate-400">(không bắt buộc)</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={feedbackData.email}
                  onChange={(e) => handleFeedbackChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <i className="fas fa-message mr-2"></i>Lời góp ý <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Chia sẻ ý kiến hoặc đề xuất của bạn để cải thiện trang web..."
                  value={feedbackData.feedback}
                  onChange={(e) => handleFeedbackChange('feedback', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-slate-500">
                  {feedbackData.feedback.length} ký tự
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={validateAndSubmitFeedback}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner text-base animate-spin"></i>
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane text-base"></i>
                    <span>Gửi góp ý</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

