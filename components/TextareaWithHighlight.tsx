import React, { useRef, useEffect } from 'react';

interface TextareaWithHighlightProps {
  value: string;
  onChange: (value: string) => void;
  highlightRange?: { start: number; end: number } | null;
}

const TextareaWithHighlight: React.FC<TextareaWithHighlightProps> = ({ 
  value, 
  onChange,
  highlightRange 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (containerRef.current && textareaRef.current) {
      // Sync scroll position
      containerRef.current.scrollLeft = textareaRef.current.scrollLeft;
      containerRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [value, highlightRange]);

  const renderHighlightedText = () => {
    if (!highlightRange) {
      return value;
    }

    const { start, end } = highlightRange;
    const before = value.substring(0, start);
    const highlighted = value.substring(start, end);
    const after = value.substring(end);

    return (
      <>
        <span>{before}</span>
        <span className="bg-yellow-300 font-bold">{highlighted}</span>
        <span>{after}</span>
      </>
    );
  };

  return (
    <div className="relative">
      {/* Background highlight layer */}
      <div 
        ref={containerRef}
        className="absolute top-0 left-0 w-full h-32 p-4 font-mono text-sm bg-slate-900 text-transparent pointer-events-none overflow-hidden rounded-xl"
        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
      >
        {renderHighlightedText()}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => {
          if (containerRef.current) {
            containerRef.current.scrollLeft = e.currentTarget.scrollLeft;
            containerRef.current.scrollTop = e.currentTarget.scrollTop;
          }
        }}
        className="w-full h-32 p-4 font-mono text-sm bg-slate-900 text-slate-100 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none resize-none relative z-10"
        spellCheck={false}
      />
    </div>
  );
};

export default TextareaWithHighlight;

