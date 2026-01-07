
import React from 'react';
import { SQLLogicalStep, ExecutionSnapshot } from '../types';

interface ExecutionFlowProps {
  steps: ExecutionSnapshot[];
  currentIndex: number;
  onStepClick: (index: number) => void;
}

const ExecutionFlow: React.FC<ExecutionFlowProps> = ({ steps, currentIndex, onStepClick }) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-6 overflow-x-auto">
      {steps.map((step, idx) => {
        const isActive = idx === currentIndex;
        const isPast = idx < currentIndex;
        
        return (
          <React.Fragment key={idx}>
            <div 
              onClick={() => onStepClick(idx)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-110' : 
                    isPast ? 'bg-indigo-100 border-indigo-200 text-indigo-600' : 
                    'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300'}
                `}
              >
                <span className="text-xs font-bold">{idx + 1}</span>
              </div>
              <span className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {step.step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 min-w-[20px] bg-slate-200 relative">
                <div 
                  className={`absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-500 ${isPast ? 'w-full' : 'w-0'}`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ExecutionFlow;
