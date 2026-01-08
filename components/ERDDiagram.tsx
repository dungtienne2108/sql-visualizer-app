import React, { useEffect } from 'react';
import mermaid from 'mermaid';
import { Table } from '../types';

interface ERDDiagramProps {
  tables: Record<string, Table>;
}

const ERDDiagram: React.FC<ERDDiagramProps> = ({ tables }) => {
  const generateERDSyntax = () => {
    // Định nghĩa relationship từ dữ liệu
    const relationships = [
      { from: 'users', to: 'orders', fromKey: 'id', toKey: 'user_id', type: 'one_to_many' },
      { from: 'users', to: 'departments', fromKey: 'id', toKey: 'manager_id', type: 'one_to_many' },
    ];

    let erd = 'erDiagram\n';

    // Thêm các entity
    Object.values(tables).forEach(table => {
      erd += `    ${table.name.toUpperCase()} {\n`;
      table.columns.forEach(col => {
        // Xác định primary key (giả sử là cột id hoặc *_id)
        const isPK = col === 'id' || col.endsWith('_id');
        erd += `        ${isPK ? 'int' : 'string'} ${col}\n`;
      });
      erd += '    }\n';
    });

    // Thêm relationships
    relationships.forEach(rel => {
      if (tables[rel.from] && tables[rel.to]) {
        // "one_to_many" means: one entity has many of another
        const direction = rel.type === 'one_to_many' ? '||--o{' : '||--||';
        erd += `    ${rel.from.toUpperCase()} ${direction} ${rel.to.toUpperCase()} : "có"\n`;
      }
    });

    return erd;
  };

  useEffect(() => {
    const initializeMermaid = async () => {
      try {
        mermaid.initialize({ 
          startOnLoad: true, 
          theme: 'default',
          securityLevel: 'loose',
          er: {
            fontSize: 14,
            width: 100,
            padding: 20,
          }
        });
        mermaid.contentLoaded();
      } catch (e) {
        console.error('Mermaid initialization error:', e);
      }
    };

    initializeMermaid();
  }, []);

  const erdSyntax = generateERDSyntax();

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          <i className="fas fa-diagram-project text-purple-600 mr-3"></i>Sơ Đồ Mối Quan Hệ (ERD)
        </h1>
        <p className="text-slate-600">Hiển thị mối quan hệ giữa các bảng dữ liệu</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 bg-slate-50">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          {Object.keys(tables).length > 0 ? (
            <div className="mermaid">
              {erdSyntax}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <i className="fas fa-inbox text-5xl mb-4 opacity-50"></i>
              <p className="text-lg font-medium">Không có dữ liệu</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase mb-2">
              <i className="fas fa-one-to-many mr-2 text-purple-600"></i>Ký Hiệu
            </p>
            <p className="text-sm text-slate-700">
              <code className="bg-slate-50 px-2 py-1 rounded">{"||--o{"}</code> = 1 đối nhiều
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase mb-2">
              <i className="fas fa-key mr-2 text-green-600"></i>Primary Key
            </p>
            <p className="text-sm text-slate-700">
              Cột kết thúc bằng <code className="bg-slate-50 px-2 py-1 rounded">_id</code>
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase mb-2">
              <i className="fas fa-link mr-2 text-blue-600"></i>Foreign Key
            </p>
            <p className="text-sm text-slate-700">
              Kết nối giữa các bảng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERDDiagram;

