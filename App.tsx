
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_TABLES, SAMPLE_QUERIES, EXAMPLES } from './constants';
import { AppState, ExecutionSnapshot, SQLLogicalStep } from './types';
import { parseSQL } from './services/sqlParser';
import { generateExecutionSteps } from './services/executionEngine';
import DataBrowser from './components/DataBrowser';
import Navbar from './components/Navbar';
import TextareaWithHighlight from './components/TextareaWithHighlight';
import ExampleSelector from './components/ExampleSelector';
import QueryHistory from './components/QueryHistory';
import WelcomeModal from './components/WelcomeModal';
import ERDDiagram from './components/ERDDiagram';
import QueryVisualizationPanel from './components/QueryVisualizationPanel';
import { findClauseRange } from './utils/sqlHighlighter';
import { useQueryHistory } from './hooks/useQueryHistory';

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
  const [isExecuted, setIsExecuted] = useState<boolean>(false);
  const { history, addToHistory, removeFromHistory, clearHistory } = useQueryHistory();
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
      setIsExecuted(true);
      // Add to history after successful execution
      addToHistory(state.currentQuery);
    } catch (e: any) {
      setState(prev => ({
        ...prev,
        error: e.message,
        executionSteps: [],
      }));
      setIsExecuted(true);
    }
  }, [state.currentQuery, state.tables, addToHistory]);

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
                  <div className="space-y-2">
                    <ExampleSelector 
                      examples={EXAMPLES} 
                      onSelect={(query) => {
                        setState(prev => ({ ...prev, currentQuery: query }));
                        setIsExecuted(false);
                      }}
                    />
                    <QueryHistory
                      history={history}
                      onSelect={(query) => {
                        setState(prev => ({ ...prev, currentQuery: query }));
                        setIsExecuted(false);
                      }}
                      onRemove={removeFromHistory}
                      onClear={clearHistory}
                    />
                  </div>
                  <div className="mt-3"></div>
                  <TextareaWithHighlight 
                    value={state.currentQuery}
                    onChange={(e) => {
                      setState(prev => ({ ...prev, currentQuery: e }));
                      setIsExecuted(false);
                    }}
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

            {/* Right Panel: Show ERD or Query Visualization */}
            <div className="lg:col-span-8 overflow-hidden bg-white">
              {!isExecuted || state.currentQuery.trim() === '' ? (
                <ERDDiagram tables={state.tables} />
              ) : (
                <QueryVisualizationPanel
                  currentSnapshot={currentSnapshot}
                  executionSteps={state.executionSteps}
                  currentStepIndex={state.currentStepIndex}
                  isPlaying={state.isPlaying}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onReset={handleReset}
                  onTogglePlay={handleTogglePlay}
                  onStepClick={(idx) => setState(prev => ({ ...prev, currentStepIndex: idx, isPlaying: false }))}
                  tableResultPage={tableResultPage}
                  onTablePageChange={setTableResultPage}
                />
              )}
            </div>
          </div>
        )}
      </main>
      
    </div>
  );
};

export default App;
