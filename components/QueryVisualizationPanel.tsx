import React from 'react';
import { ExecutionSnapshot, SQLLogicalStep } from '../types';
import ExecutionFlow from './ExecutionFlow';
import TableView from './TableView';
import JoinVisualization from './JoinVisualization';
import Pagination from './Pagination';

interface QueryVisualizationPanelProps {
  currentSnapshot: ExecutionSnapshot | null;
  executionSteps: ExecutionSnapshot[];
  currentStepIndex: number;
  isPlaying: boolean;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onTogglePlay: () => void;
  onStepClick: (idx: number) => void;
  tableResultPage: number;
  onTablePageChange: (page: number) => void;
}

const QueryVisualizationPanel: React.FC<QueryVisualizationPanelProps> = ({
  currentSnapshot,
  executionSteps,
  currentStepIndex,
  isPlaying,
  onNext,
  onPrev,
  onReset,
  onTogglePlay,
  onStepClick,
  tableResultPage,
  onTablePageChange,
}) => {
  const ROWS_PER_PAGE = 10;

  return (
    <div className="lg:col-span-8 flex flex-col bg-white overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white z-10 sticky top-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
            title="Quay về đầu"
          >
            <i className="fas fa-undo"></i>
          </button>
          <button
            onClick={onPrev}
            disabled={currentStepIndex === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30"
            title="Bước trước"
          >
            <i className="fas fa-step-backward"></i>
          </button>
          <button
            onClick={onTogglePlay}
            className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-all scale-100 active:scale-90"
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button
            onClick={onNext}
            disabled={currentStepIndex === executionSteps.length - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30"
            title="Bước tiếp theo"
          >
            <i className="fas fa-step-forward"></i>
          </button>
        </div>

        <div className="flex-1 max-w-lg mx-6">
          <ExecutionFlow
            steps={executionSteps}
            currentIndex={currentStepIndex}
            onStepClick={onStepClick}
          />
        </div>

        <div className="hidden sm:block">
          <span className="text-sm font-bold text-slate-400">
            Bước {currentStepIndex + 1} / {executionSteps.length}
          </span>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
        {currentSnapshot ? (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                  {currentStepIndex + 1}
                </span>
                Kết quả {currentSnapshot.title}
              </h2>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>
                  <i className="fas fa-columns mr-1"></i>Cột: {currentSnapshot.columns.length}
                </span>
                <span>
                  <i className="fas fa-bars mr-1"></i>Dòng: {currentSnapshot.rows.length}
                </span>
              </div>
            </div>

            {[
              SQLLogicalStep.JOIN_SCAN_LEFT,
              SQLLogicalStep.JOIN_SCAN_RIGHT,
              SQLLogicalStep.JOIN_MATCH,
              SQLLogicalStep.JOIN_BUILD
            ].includes(currentSnapshot.step as SQLLogicalStep) ? (
              <JoinVisualization snapshot={currentSnapshot} />
            ) : (
              <>
                {(() => {
                  const totalPages = Math.ceil(currentSnapshot.rows.length / ROWS_PER_PAGE);
                  const start = (tableResultPage - 1) * ROWS_PER_PAGE;
                  const end = start + ROWS_PER_PAGE;
                  const paginatedSnapshot = {
                    ...currentSnapshot,
                    rows: currentSnapshot.rows.slice(start, end)
                  };
                  return (
                    <>
                      <TableView snapshot={paginatedSnapshot} />
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={tableResultPage}
                          totalPages={totalPages}
                          onPageChange={onTablePageChange}
                        />
                      )}
                    </>
                  );
                })()}
              </>
            )}

            {currentSnapshot.step === 'WHERE' && (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
                <i className="fas fa-lightbulb text-orange-400 mt-1"></i>
                <div>
                  <p className="text-sm font-bold text-orange-800">
                    <i className="fas fa-eye-slash mr-2"></i>Gợi ý trực quan
                  </p>
                  <p className="text-sm text-orange-700">Các dòng mờ và màu đỏ đại diện cho dữ liệu bị lọc ra bởi mệnh đề WHERE của bạn. Những dòng này sẽ không được chuyển sang giai đoạn tiếp theo.</p>
                </div>
              </div>
            )}

            {(currentSnapshot.step as any).toString().includes('JOIN') && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                <i className="fas fa-lightbulb text-blue-400 mt-1"></i>
                <div>
                  <p className="text-sm font-bold text-blue-800">
                    <i className="fas fa-link mr-2"></i>Giải thích JOIN
                  </p>
                  <p className="text-sm text-blue-700">
                    {currentSnapshot.step === 'JOIN_SCAN_LEFT' && 'Cơ sở dữ liệu quét bảng bên trái trước tiên (mệnh đề FROM).'}
                    {currentSnapshot.step === 'JOIN_SCAN_RIGHT' && 'Sau đó, nó quét bảng bên phải (mệnh đề JOIN).'}
                    {currentSnapshot.step === 'JOIN_MATCH' && 'Tiếp theo, nó khớp các dòng từ cả hai bảng dựa trên điều kiện ON. Chỉ những dòng đáp ứng điều kiện mới được giữ lại.'}
                    {currentSnapshot.step === 'JOIN_BUILD' && 'Cuối cùng, nó kết hợp các dòng khớp thành một tập kết quả với các cột từ cả hai bảng.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
              <i className="fas fa-terminal"></i>
            </div>
            <p className="text-lg font-medium">Nhập một truy vấn và bấm Chạy để bắt đầu trực quan hóa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryVisualizationPanel;

