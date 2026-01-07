import React from 'react';
import { ExecutionSnapshot, TableRow } from '../types';

interface GroupByVisualizationProps {
  snapshot: ExecutionSnapshot;
}

const GroupByVisualization: React.FC<GroupByVisualizationProps> = ({ snapshot }) => {
  const { columns, rows, metadata } = snapshot;

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border-2 border-dashed border-slate-200">
        <i className="fas fa-table-list text-4xl mb-3"></i>
        <p>No data to display for this step</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* GROUP BY Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4">
          <p className="text-[10px] text-blue-400 font-bold uppercase mb-2">Total Rows Before</p>
          <p className="text-2xl font-bold text-blue-600">{metadata.rowCount || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-4">
          <p className="text-[10px] text-purple-400 font-bold uppercase mb-2">Groups Created</p>
          <p className="text-2xl font-bold text-purple-600">{metadata.groupCount || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4">
          <p className="text-[10px] text-green-400 font-bold uppercase mb-2">Avg Group Size</p>
          <p className="text-2xl font-bold text-green-600">
            {metadata.groupCount ? Math.round((metadata.rowCount || 0) / metadata.groupCount * 10) / 10 : 0}
          </p>
        </div>
      </div>

      {/* GROUP BY Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={col} 
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${
                    idx === 0 
                      ? 'text-purple-600 bg-purple-50/30 border-r border-slate-200' 
                      : 'text-slate-500'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
            <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIdx) => {
              const groupColor = rowIdx % 2 === 0 ? 'bg-slate-50/40' : 'bg-white';
              return (
                <tr key={row._id} className={`transition-colors ${groupColor} hover:bg-purple-100/30 border-l-4 border-purple-400`}>
                  {columns.map((col, colIdx) => (
                    <td 
                      key={`${row._id}-${col}`}
                      className={`px-4 py-3 text-sm font-medium text-slate-700 font-mono ${
                        colIdx === 0 ? 'border-r border-slate-100 bg-purple-50/40 font-bold text-purple-700' : ''
                      }`}
                    >
                      {renderValue(row[col])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Information Panel */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-3">
        <i className="fas fa-lightbulb text-purple-400 mt-1"></i>
        <div>
          <p className="text-sm font-bold text-purple-800">GROUP BY Explanation</p>
          <p className="text-sm text-purple-700 mt-1">
            The first column in each row represents the GROUP BY key(s). All rows with the same key value are combined into one group. 
            The remaining columns show aggregated results (COUNT, SUM, AVG, etc.) for each group.
          </p>
        </div>
      </div>
    </div>
  );
};

const renderValue = (val: any) => {
  if (val === null) return <span className="text-slate-300 italic">null</span>;
  if (typeof val === 'boolean') return <span className={val ? 'text-green-600' : 'text-red-600'}>{String(val)}</span>;
  return String(val);
};

export default GroupByVisualization;

