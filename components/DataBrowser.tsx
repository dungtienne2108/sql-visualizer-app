import React, { useMemo } from 'react';
import { Table } from '../types';
import Pagination from './Pagination';

interface DataBrowserProps {
  tables: Record<string, Table>;
  selectedTable: string;
  currentPage: number;
  onTableSelect: (tableName: string) => void;
  onPageChange: (page: number) => void;
}

const DataBrowser: React.FC<DataBrowserProps> = ({
  tables,
  selectedTable,
  currentPage,
  onTableSelect,
  onPageChange,
}) => {
  const ROWS_PER_PAGE = 10;
  const table = tables[selectedTable];
  
  const paginatedData = useMemo(() => {
    if (!table) return { rows: [], totalPages: 1 };
    const totalPages = Math.ceil(table.rows.length / ROWS_PER_PAGE);
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return {
      rows: table.rows.slice(start, end),
      totalPages,
    };
  }, [table, currentPage]);

  const renderValue = (val: any) => {
    if (val === null || val === undefined) return <span className="text-slate-300">NULL</span>;
    if (typeof val === 'boolean') return val ? '✓ true' : '✗ false';
    return String(val);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          <i className="fas fa-database text-indigo-600 mr-3"></i>Trình duyệt dữ liệu
        </h1>
        <p className="text-slate-600 mb-4">Khám phá cơ sở dữ liệu trong bộ nhớ JSON với phân trang hỗ trợ</p>

        {/* Table Selector */}
        <div className="flex gap-2 flex-wrap">
          {Object.keys(tables).map((tableName) => {
            const rowCount = tables[tableName].rows.length;
            const colCount = tables[tableName].columns.length;
            return (
              <button
                key={tableName}
                onClick={() => {
                  onTableSelect(tableName);
                  onPageChange(1);
                }}
                className={`px-4 py-3 rounded-lg font-semibold transition-all shadow-sm ${
                  selectedTable === tableName
                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-400'
                }`}
              >
                <i className={`fas ${selectedTable === tableName ? 'fa-table' : 'fa-folder'} mr-2`}></i>
                {tableName}
                <span className="ml-2 text-xs opacity-75">
                  ({rowCount} {rowCount === 1 ? 'dòng' : 'dòng'} × {colCount} cột)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {table ? (
          <div className="space-y-4">
            {/* Table Info */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-blue-600 font-bold uppercase mb-1">
                  <i className="fas fa-columns mr-2"></i>Cột
                </p>
                <p className="text-2xl font-bold text-blue-700">{table.columns.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <p className="text-xs text-green-600 font-bold uppercase mb-1">
                  <i className="fas fa-bars mr-2"></i>Dòng
                </p>
                <p className="text-2xl font-bold text-green-700">{table.rows.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <p className="text-xs text-purple-600 font-bold uppercase mb-1">
                  <i className="fas fa-layer-group mr-2"></i>Trang
                </p>
                <p className="text-2xl font-bold text-purple-700">{paginatedData.totalPages}</p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900 sticky top-0">
                    <tr>
                      {table.columns.map((col, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-r border-slate-700 last:border-r-0"
                        >
                          <i className="fas fa-code mr-2 opacity-60"></i>{col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.rows.map((row, rowIdx) => (
                      <tr
                        key={row._id}
                        className="hover:bg-slate-50 transition-colors even:bg-slate-50/40"
                      >
                        {table.columns.map((col, colIdx) => (
                          <td
                            key={`${row._id}-${col}`}
                            className={`px-4 py-3 text-sm font-mono text-slate-700 border-r border-slate-100 last:border-r-0 ${
                              colIdx === 0 ? 'font-bold text-indigo-600' : ''
                            }`}
                          >
                            {renderValue(row[col as keyof typeof row])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={paginatedData.totalPages}
              onPageChange={onPageChange}
            />

            {/* Row Info */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span>
                Đang hiển thị dòng {Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, table.rows.length)} đến{' '}
                {Math.min(currentPage * ROWS_PER_PAGE, table.rows.length)} trong {table.rows.length}
              </span>
              <span className="font-semibold">
                {paginatedData.rows.length} dòng được tải
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <i className="fas fa-inbox text-5xl mb-4 opacity-50"></i>
            <p className="text-lg font-medium">Không có dữ liệu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataBrowser;

