import React, { useState, useEffect } from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? 'bg-black/50' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
         {/* Header with gradient */}
         <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-database text-2xl"></i>
              </div>
              <h1 className="text-3xl font-bold">SQL Visualizer</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-100">
                  <i className="fas fa-eye text-indigo-600 text-lg"></i>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Hiểu SQL Một Cách Trực Quan</h3>
                <p className="text-slate-600 mt-1">
                  SQL Visualizer giúp bạn thấy được cách cơ sở dữ liệu thực thi các truy vấn SQL theo một thứ tự logic nhất định, không phải thứ tự cú pháp.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100">
                  <i className="fas fa-play text-purple-600 text-lg"></i>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Xem Từng Bước Thực Thi</h3>
                <p className="text-slate-600 mt-1">
                  Chạy truy vấn và xem từng bước thực thi một cách chi tiết.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-pink-100">
                  <i className="fas fa-chart-bar text-pink-600 text-lg"></i>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Khám Phá Dữ Liệu</h3>
                <p className="text-slate-600 mt-1">
                  Duyệt qua các bảng dữ liệu mẫu, xem cấu trúc, và hiểu rõ cách chúng được kết nối với nhau.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200"></div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-slate-700 flex items-start gap-2">
              <i className="fas fa-lightbulb text-amber-500 mt-0.5 flex-shrink-0"></i>
              <span>
                <strong>Mẹo:</strong> Chọn một ví dụ từ danh sách, sau đó bấm "Chạy" để thấy trực quan hóa. Thử thay đổi truy vấn để tìm hiểu cách SQL thực sự hoạt động!
              </span>
            </p>
          </div>
        </div>

        {/* Footer with button */}
        <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95"
          >
            <i className="fas fa-arrow-right mr-2"></i>Bắt Đầu
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;

