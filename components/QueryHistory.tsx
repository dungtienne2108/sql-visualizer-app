import React, { useState } from 'react';
import { HistoryItem } from '../hooks/useQueryHistory';

interface QueryHistoryProps {
  history: HistoryItem[];
  onSelect: (query: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const QueryHistory: React.FC<QueryHistoryProps> = ({
  history,
  onSelect,
  onRemove,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'vừa xong';
    if (diffMins < 60) return `${diffMins}m trước`;
    if (diffHours < 24) return `${diffHours}h trước`;
    if (diffDays < 7) return `${diffDays}d trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const handleSelect = (query: string) => {
    onSelect(query);
    setIsOpen(false);
  };

  if (!history.length) {
    return (
      <div className="relative">
        <button
          disabled
          className="w-full px-4 py-2 text-sm text-slate-400 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed"
        >
          <i className="fas fa-clock mr-2"></i>Lịch sử trống
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between"
      >
        <span>
          <i className="fas fa-history mr-2 text-indigo-600"></i>
          Lịch sử ({history.length})
        </span>
        <i className={`fas fa-chevron-down text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="px-4 py-3 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => handleSelect(item.query)}
                      className="flex-1 text-left cursor-pointer"
                    >
                      <p className="text-sm font-mono text-slate-700 truncate hover:text-indigo-600">
                        {item.query}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatTime(item.timestamp)}
                      </p>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.id);
                      }}
                      className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Xóa"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-broom"></i>
                Xóa tất cả
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QueryHistory;

