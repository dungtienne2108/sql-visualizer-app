
import React from 'react';
import { ExecutionSnapshot, TableRow } from '../types';

interface TableViewProps {
  snapshot: ExecutionSnapshot;
}

const TableView: React.FC<TableViewProps> = ({ snapshot }) => {
  const { columns, rows } = snapshot;

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border-2 border-dashed border-slate-200">
        <i className="fas fa-table-list text-4xl mb-3"></i>
        <p>No data to display for this step</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map(col => (
              <th key={col} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr 
              key={row._id} 
              className={`transition-colors duration-300 ${row._isExcluded ? 'opacity-50 bg-red-50' : 'hover:bg-blue-50/30'}`}
              style={row._isExcluded ? { textDecoration: 'line-through' } : {}}
            >
              {columns.map(col => (
                <td key={col} className={`px-4 py-3 text-sm font-medium font-mono ${row._isExcluded ? 'text-red-400' : 'text-slate-700'}`}>
                  {renderValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderValue = (val: any) => {
  if (val === null) return <span className="text-slate-300 italic">null</span>;
  if (typeof val === 'boolean') return <span className={val ? 'text-green-600' : 'text-red-600'}>{String(val)}</span>;
  return String(val);
};

export default TableView;
