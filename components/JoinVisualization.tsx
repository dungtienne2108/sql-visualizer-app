
import React from 'react';
import { ExecutionSnapshot, TableRow } from '../types';
import Pagination from './Pagination';

interface JoinVisualizationProps {
  snapshot: ExecutionSnapshot;
}

const JoinVisualization: React.FC<JoinVisualizationProps> = ({ snapshot }) => {
  const { columns, rows, metadata } = snapshot;

  // For JOIN_MATCH step, we don't have actual rows to display
  if (snapshot.step === 'JOIN_MATCH') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block mb-4">
                <i className="fas fa-arrows-left-right text-indigo-600 text-4xl"></i>
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-2">Số dòng hợp lệ</p>
              <p className="text-2xl font-bold text-indigo-600">{metadata.matchCount || 0}</p>
              <p className="text-xs text-slate-400 mt-2">cặp dòng hợp lệ</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <p className="text-[10px] text-indigo-400 font-bold uppercase mb-2">Điều kiện JOIN</p>
          <p className="text-sm font-mono text-indigo-800">{metadata.highlightedClause}</p>
        </div>
      </div>
    );
  }

  // For SCAN_LEFT and SCAN_RIGHT, show simple table with highlight
  if (snapshot.step === 'JOIN_SCAN_LEFT' || snapshot.step === 'JOIN_SCAN_RIGHT') {
    const isLeftTable = snapshot.step === 'JOIN_SCAN_LEFT';
    const tableName = isLeftTable ? metadata.joinLeftTable : metadata.joinRightTable;

    if (rows.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border-2 border-dashed border-slate-200">
          <i className="fas fa-table-list text-4xl mb-3"></i>
          <p>No data to display</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {columns.map(col => (
                  <th 
                    key={col} 
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${
                      isLeftTable ? 'text-blue-600 bg-blue-50/30' : 'text-green-600 bg-green-50/30'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50/50 transition-colors">
                  {columns.map(col => (
                    <td key={col} className="px-4 py-3 text-sm font-medium text-slate-700 font-mono">
                      {renderValue(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`p-4 rounded-xl border ${isLeftTable ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100'}`}>
          <p className={`text-[10px] font-bold uppercase mb-2 ${isLeftTable ? 'text-blue-400' : 'text-green-400'}`}>
            {isLeftTable ? 'Bảng trái (FROM)' : 'Bảng phải (JOIN)'}
          </p>
          <p className={`text-sm font-mono ${isLeftTable ? 'text-blue-800' : 'text-green-800'}`}>
            {tableName} - {rows.length} row{rows.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    );
  }

  // For JOIN_BUILD, show combined table with visual separation
  if (snapshot.step === 'JOIN_BUILD') {
    if (rows.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border-2 border-dashed border-slate-200">
          <i className="fas fa-table-list text-4xl mb-3"></i>
          <p>Không có dòng kết hợp</p>
        </div>
      );
    }

    // Separate columns by table
    const leftTableName = Object.keys(snapshot.rows[0] || {}).find(col => col.includes('.'))?.split('.')[0] || '';
    const leftCols = columns.filter(col => col.startsWith(leftTableName + '.'));
    const rightCols = columns.filter(col => !col.startsWith(leftTableName + '.'));

    const joinType = metadata.joinType || 'INNER';
    const matchedCount = metadata.matchCount || 0;
    const unmatchedCount = metadata.unmatchedCount || 0;
    
    return (
      <div className="space-y-4">
        {/* Stats for outer joins */}
        {(joinType === 'LEFT' || joinType === 'RIGHT' || joinType === 'FULL') && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-3">
              <p className="text-[10px] text-green-400 font-bold uppercase mb-1">Hợp lệ</p>
              <p className="text-xl font-bold text-green-600">{matchedCount}</p>
            </div>
            {unmatchedCount > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-3">
                <p className="text-[10px] text-orange-400 font-bold uppercase mb-1">Không hợp lệ</p>
                <p className="text-xl font-bold text-orange-600">{unmatchedCount}</p>
              </div>
            )}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-3">
              <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Tổng số</p>
              <p className="text-xl font-bold text-blue-600">{matchedCount + unmatchedCount}</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {leftCols.map(col => (
                  <th key={col} className="px-4 py-3 text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50/30 border-r border-slate-200">
                    {col.replace(/.*\./, '')}
                  </th>
                ))}
                {rightCols.map(col => (
                  <th key={col} className="px-4 py-3 text-xs font-semibold text-green-600 uppercase tracking-wider bg-green-50/30">
                    {col.replace(/.*\./, '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => {
                const isUnmatched = row._isUnmatched;
                let rowBgClass = "hover:bg-indigo-50/30 transition-colors";
                if (isUnmatched) {
                  rowBgClass = "bg-yellow-50/50 opacity-75";
                }
                
                return (
                  <tr key={row._id} className={rowBgClass}>
                    {leftCols.map(col => (
                      <td 
                        key={col} 
                        className={`px-4 py-3 text-sm font-medium font-mono border-r border-slate-100 ${
                          row[col] === null ? 'text-slate-300 italic' : 'text-slate-700'
                        }`}
                      >
                        {renderValue(row[col])}
                      </td>
                    ))}
                    {rightCols.map(col => (
                      <td 
                        key={col} 
                        className={`px-4 py-3 text-sm font-medium font-mono ${
                          row[col] === null ? 'text-slate-300 italic' : 'text-slate-700'
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

        {/* Show unmatched info */}
        {metadata.unmatchedCount !== undefined && metadata.unmatchedCount > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
            <i className="fas fa-exclamation-triangle text-yellow-500 mt-1"></i>
            <div>
              <p className="text-sm font-bold text-yellow-800">Số dòng không hợp lệ ({metadata.unmatchedCount})</p>
              <p className="text-sm text-yellow-700">
                {joinType === 'LEFT' && "Các dòng từ bảng trái không có kết hợp trong bảng phải. Giá trị NULL được hiển thị cho các cột của bảng phải."}
                {joinType === 'RIGHT' && "Các dòng từ bảng phải không có kết hợp trong bảng trái. Giá trị NULL được hiển thị cho các cột của bảng trái."}
                {joinType === 'FULL' && "Các dòng không có kết hợp trong bảng khác. Giá trị NULL được hiển thị cho các cột từ bảng không có kết hợp."}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default table view for other steps
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border-2 border-dashed border-slate-200">
        <i className="fas fa-table-list text-4xl mb-3"></i>
        <p>Không có dữ liệu để hiển thị cho bước này</p>
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
            <tr key={row._id} className="hover:bg-blue-50/30 transition-colors">
              {columns.map(col => (
                <td key={col} className="px-4 py-3 text-sm font-medium text-slate-700 font-mono">
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

export default JoinVisualization;

