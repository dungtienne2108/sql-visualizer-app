import React, { useState } from 'react';

interface Example {
  query: string;
  description: string;
  category: string;
}

interface ExampleSelectorProps {
  examples: Example[];
  onSelect: (query: string) => void;
}

const ExampleSelector: React.FC<ExampleSelectorProps> = ({ examples, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [...new Set(examples.map(e => e.category))];
  
  const groupedExamples = categories.reduce((acc, cat) => {
    acc[cat] = examples.filter(e => e.category === cat);
    return acc;
  }, {} as Record<string, Example[]>);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Cơ bản': return 'fa-database';
      case 'Lọc dữ liệu': return 'fa-filter';
      case 'Nhóm & Tổng hợp': return 'fa-cubes';
      case 'Sắp xếp': return 'fa-arrow-down-a-z';
      case 'Kết nối bảng': return 'fa-link';
      default: return 'fa-star';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Cơ bản': return 'from-blue-50 to-blue-100 border-blue-200';
      case 'Lọc dữ liệu': return 'from-green-50 to-green-100 border-green-200';
      case 'Nhóm & Tổng hợp': return 'from-purple-50 to-purple-100 border-purple-200';
      case 'Sắp xếp': return 'from-yellow-50 to-yellow-100 border-yellow-200';
      case 'Kết nối bảng': return 'from-orange-50 to-orange-100 border-orange-200';
      default: return 'from-slate-50 to-slate-100 border-slate-200';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl hover:shadow-md transition-shadow"
      >
        <span className="flex items-center space-x-2 text-slate-700">
          <i className="fas fa-book text-indigo-600"></i>
          <span className="font-semibold">Danh sách ví dụ</span>
        </span>
        <i className={`fas fa-chevron-down text-indigo-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {Object.entries(groupedExamples).map(([category, items]) => (
            <div key={category} className="border-b border-slate-100 last:border-b-0">
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${getCategoryColor(category)} border-b border-slate-200 px-4 py-2 sticky top-0`}>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                  <i className={`fas ${getCategoryIcon(category)}`}></i>
                  <span>{category}</span>
                </p>
              </div>

              {/* Examples */}
              {items.map((example, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelect(example.query);
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
                >
                  <div className="flex items-start justify-between space-x-2">
                    <div className="flex-1">
                      <p className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 mb-1 truncate hover:bg-slate-200 transition-colors">
                        {example.query.substring(0, 60)}...
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {example.description}
                      </p>
                    </div>
                    <i className="fas fa-arrow-right text-indigo-400 text-xs mt-1 flex-shrink-0"></i>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExampleSelector;

