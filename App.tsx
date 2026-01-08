
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_TABLES, SAMPLE_QUERIES, EXAMPLES } from './constants';
import { AppState, ExecutionSnapshot, SQLLogicalStep } from './types';
import { parseSQL } from './services/sqlParser';
import { generateExecutionSteps } from './services/executionEngine';
import TableView from './components/TableView';
import JoinVisualization from './components/JoinVisualization';
import ExecutionFlow from './components/ExecutionFlow';
import DataBrowser from './components/DataBrowser';
import Pagination from './components/Pagination';
import Navbar from './components/Navbar';
import TextareaWithHighlight from './components/TextareaWithHighlight';
import ExampleSelector from './components/ExampleSelector';
import WelcomeModal from './components/WelcomeModal';
import { findClauseRange } from './utils/sqlHighlighter';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentQuery: SAMPLE_QUERIES[0],
    executionSteps: [],
    currentStepIndex: 0,
    tables: INITIAL_TABLES,
    isPlaying: false,
    error: null,
  });
  const [currentPage, setCurrentPage] = useState<'home' | 'data'>('home');
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [currentTablePage, setCurrentTablePage] = useState<number>(1);
  const [tableResultPage, setTableResultPage] = useState<number>(1);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  const ROWS_PER_PAGE = 10;

  const handleRunQuery = useCallback(() => {
    try {
      const components = parseSQL(state.currentQuery);
      const steps = generateExecutionSteps(components, state.tables);
      setState(prev => ({
        ...prev,
        executionSteps: steps,
        currentStepIndex: 0,
        error: null,
      }));
    } catch (e: any) {
      setState(prev => ({
        ...prev,
        error: e.message,
        executionSteps: [],
      }));
    }
  }, [state.currentQuery, state.tables]);

  // Initial Run
  useEffect(() => {
    handleRunQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-play logic
  useEffect(() => {
    let timer: any;
    if (state.isPlaying && state.currentStepIndex < state.executionSteps.length - 1) {
      timer = setTimeout(() => {
        setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex + 1 }));
      }, 1500);
    } else if (state.currentStepIndex === state.executionSteps.length - 1) {
      setState(prev => ({ ...prev, isPlaying: false }));
    }
    return () => clearTimeout(timer);
  }, [state.isPlaying, state.currentStepIndex, state.executionSteps.length]);

  const currentSnapshot: ExecutionSnapshot | null = state.executionSteps[state.currentStepIndex] || null;

  const handleNext = () => {
    if (state.currentStepIndex < state.executionSteps.length - 1) {
      setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex + 1 }));
    }
  };

  const handlePrev = () => {
    if (state.currentStepIndex > 0) {
      setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex - 1 }));
    }
  };

  const handleReset = () => {
    setState(prev => ({ ...prev, currentStepIndex: 0, isPlaying: false }));
  };

  const handleTogglePlay = () => {
    if (state.currentStepIndex === state.executionSteps.length - 1) {
      setState(prev => ({ ...prev, currentStepIndex: 0, isPlaying: true }));
    } else {
      setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />
      
      <Navbar 
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          setCurrentTablePage(1);
          setTableResultPage(1);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {currentPage === 'data' ? (
          <DataBrowser 
            tables={state.tables}
            selectedTable={selectedTable}
            currentPage={currentTablePage}
            onTableSelect={setSelectedTable}
            onPageChange={setCurrentTablePage}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden">
        
        {/* Left Panel: Query Input & Explanations */}
        <aside className="lg:col-span-4 border-r border-slate-200 bg-slate-50 overflow-y-auto p-6 flex flex-col">
          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-700">
                  <i className="fas fa-code mr-2"></i>Trình soạn SQL
                </label>
              </div>
              <ExampleSelector 
                examples={EXAMPLES} 
                onSelect={(query) => setState(prev => ({ ...prev, currentQuery: query }))}
              />
              <div className="mt-2"></div>
              <TextareaWithHighlight 
                value={state.currentQuery}
                onChange={(e) => setState(prev => ({ ...prev, currentQuery: e }))}
                highlightRange={currentSnapshot ? findClauseRange(state.currentQuery, currentSnapshot.step) : null}
              />
              <button 
                onClick={handleRunQuery}
                className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                <i className="fas fa-play mr-2"></i>Chạy
              </button>
              {state.error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                  <i className="fas fa-circle-exclamation"></i>
                  {state.error}
                </div>
              )}
            </section>

            {currentSnapshot && (
              <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 mb-2 text-indigo-600">
                  <i className="fas fa-info-circle"></i>
                  <span className="text-xs font-bold uppercase tracking-wider">Bước {currentSnapshot.step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  <i className="fas fa-arrow-right mr-2 text-indigo-600"></i>
                  {currentSnapshot.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {currentSnapshot.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Số dòng</p>
                    <p className="text-xl font-bold text-slate-800">{currentSnapshot.metadata.rowCount}</p>
                  </div>
                  {currentSnapshot.metadata.groupCount !== undefined && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Số nhóm</p>
                      <p className="text-xl font-bold text-slate-800">{currentSnapshot.metadata.groupCount}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Mệnh đề đang xử lý</p>
                  <p className="text-sm font-mono text-indigo-800 font-bold">{currentSnapshot.metadata.highlightedClause}</p>
                </div>
              </section>
            )}

            <section className="mt-auto p-4 bg-slate-100 rounded-xl text-[11px] text-slate-500">
              <p className="font-bold mb-2 uppercase tracking-widest text-slate-400">
                <i className="fas fa-lightbulb mr-2"></i>Thứ tự thực thi logic
              </p>
              <p>Trái ngược với thứ tự cú pháp, SQL thực thi theo một thứ tự logic nhất định. Hiểu rõ điều này giúp bạn viết các truy vấn tốt hơn và gỡ lỗi các lỗi như "Không tìm thấy cột" trong mệnh đề WHERE.</p>
            </section>
          </div>
        </aside>

        {/* Right Panel: Visualization & Timeline */}
        <div className="lg:col-span-8 flex flex-col bg-white overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white z-10 sticky top-0">
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleReset}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                title="Quay về đầu"
              >
                <i className="fas fa-undo"></i>
              </button>
              <button 
                onClick={handlePrev}
                disabled={state.currentStepIndex === 0}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30"
                title="Bước trước"
              >
                <i className="fas fa-step-backward"></i>
              </button>
              <button 
                onClick={handleTogglePlay}
                className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-all scale-100 active:scale-90"
              >
                <i className={`fas ${state.isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
              <button 
                onClick={handleNext}
                disabled={state.currentStepIndex === state.executionSteps.length - 1}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30"
                title="Bước tiếp theo"
              >
                <i className="fas fa-step-forward"></i>
              </button>
            </div>

            <div className="flex-1 max-w-lg mx-6">
              <ExecutionFlow 
                steps={state.executionSteps} 
                currentIndex={state.currentStepIndex}
                onStepClick={(idx) => setState(prev => ({ ...prev, currentStepIndex: idx, isPlaying: false }))}
              />
            </div>

            <div className="hidden sm:block">
              <span className="text-sm font-bold text-slate-400">
                Bước {state.currentStepIndex + 1} / {state.executionSteps.length}
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
                      {state.currentStepIndex + 1}
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
                              onPageChange={setTableResultPage}
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
          </div>
        )}
      </main>
      
    </div>
  );
};

export default App;
