"use client";

import React, { useRef, useEffect, useState } from 'react';

interface BrickVisualizerProps {
  data: Record<string, string>;
  searchQuery: string;
  currentHighlightPos?: string;
  onBrickClick?: (position: string) => void;
}

const BrickVisualizer: React.FC<BrickVisualizerProps> = ({
  data,
  searchQuery,
  currentHighlightPos,
  onBrickClick
}) => {
  const highlightedBrickRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // On initial load, add animation
  useEffect(() => {
    if (initialLoad) {
      setTimeout(() => setInitialLoad(false), 500);
    }
  }, [initialLoad]);
  
  // Scroll to highlighted brick if specified
  useEffect(() => {
    if (currentHighlightPos && highlightedBrickRef.current && containerRef.current) {
      setIsScrolling(true);
      
      // Calculate position to scroll to center the highlighted brick
      const brick = highlightedBrickRef.current;
      const container = containerRef.current;
      const brickTop = brick.offsetTop;
      const brickHeight = brick.offsetHeight;
      const containerHeight = container.offsetHeight;
      const scrollPosition = brickTop - (containerHeight / 2) + (brickHeight / 2);
      
      // Smooth scroll to position
      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
      
      // Reset scrolling state after animation
      setTimeout(() => setIsScrolling(false), 800);
    }
  }, [currentHighlightPos]);
  
  // Function to check if a brick should be highlighted based on search query
  const shouldHighlight = (text: string): boolean => {
    return searchQuery.trim() !== '' && 
           text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Function to render a brick with proper line breaks
  const renderBrickText = (text: string): React.ReactNode => {
    if (!text) return null;
    
    // Replace backslashes with line breaks
    const lines = text.split('\\');
    
    // If search is active, highlight the matching text
    if (searchQuery.trim() !== '') {
      return lines.map((line, index) => {
        const lowerLine = line.toLowerCase();
        const lowerQuery = searchQuery.toLowerCase();
        const queryIndex = lowerLine.indexOf(lowerQuery);
        
        if (queryIndex !== -1) {
          // Split the line to highlight the matching part
          const before = line.substring(0, queryIndex);
          const match = line.substring(queryIndex, queryIndex + searchQuery.length);
          const after = line.substring(queryIndex + searchQuery.length);
          
          return (
            <React.Fragment key={index}>
              {before}
              <span className="font-bold bg-yellow-200">{match}</span>
              {after}
              {index < lines.length - 1 && <br />}
            </React.Fragment>
          );
        }
        
        return (
          <React.Fragment key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </React.Fragment>
        );
      });
    }
    
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Function to render a single brick
  const renderBrick = (row: number, col: number): React.ReactNode => {
    const key = `${row}-${col}`;
    const text = data[key] || '';
    const isEmpty = !text;
    const highlight = shouldHighlight(text);
    const isCurrentHighlight = key === currentHighlightPos;
    const brickClasses = [
      isEmpty ? 'empty-brick' : 'brick',
      highlight ? 'highlight' : '',
      isCurrentHighlight ? 'current-highlight' : '',
      'w-full h-16 p-2 text-center flex items-center justify-center text-xs',
      !isEmpty ? 'cursor-pointer' : '',
      initialLoad ? `opacity-0 animate-[fadeIn_0.5s_ease-in_${0.05 * col + 0.01 * row}s_forwards]` : ''
    ].filter(Boolean).join(' ');
    
    return (
      <div 
        key={key}
        ref={isCurrentHighlight ? highlightedBrickRef : null}
        className={brickClasses}
        title={text}
        onClick={() => !isEmpty && onBrickClick && onBrickClick(key)}
      >
        {renderBrickText(text)}
      </div>
    );
  };

  // Function to render a single row
  const renderRow = (row: number): React.ReactNode => {
    const rowInPattern = (row - 1) % 4;
    
    if (rowInPattern === 0) { // First row: bricks in even columns
      return (
        <div key={`row-${row}`} className="grid grid-cols-5 gap-1 mb-1">
          <div className="empty-brick"></div>
          {renderBrick(row, 1)}
          <div className="empty-brick"></div>
          {renderBrick(row, 3)}
          <div className="empty-brick"></div>
        </div>
      );
    } else if (rowInPattern === 2) { // Third row: bricks in odd columns
      return (
        <div key={`row-${row}`} className="grid grid-cols-5 gap-1 mb-1">
          {renderBrick(row, 0)}
          <div className="empty-brick"></div>
          {renderBrick(row, 2)}
          <div className="empty-brick"></div>
          {renderBrick(row, 4)}
        </div>
      );
    } else { // Empty rows (2nd and 4th)
      return (
        <div key={`row-${row}`} className="h-2 mb-1"></div>
      );
    }
  };

  // Get maximum row from data
  const allRowNumbers = Object.keys(data).map(key => parseInt(key.split('-')[0]));
  const maxRow = allRowNumbers.length > 0 ? Math.max(...allRowNumbers) : 0;
  
  // Create an array of all rows from 1 to maxRow
  const rows = [];
  for (let row = maxRow; row >= 1; row--) {
    rows.push(renderRow(row));
  }

  // Render a scrolling indicator
  const renderScrollIndicator = () => {
    if (isScrolling) {
      return (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute h-full w-full flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-blue-500 bg-opacity-10 flex items-center justify-center animate-ping">
              <div className="h-12 w-12 rounded-full bg-blue-500 bg-opacity-20"></div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="brick-visualizer h-full flex flex-col relative">
      <div className="text-center mb-4">
        <div className="text-xs inline-block px-3 py-1.5 bg-gray-800 text-white rounded-full">
          Row {maxRow} (top)
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="vertical-bricks relative flex-grow overflow-y-auto custom-scrollbar bg-gray-50 rounded border border-gray-200"
      >
        {renderScrollIndicator()}
        {rows}
      </div>
      
      <div className="text-center mt-4">
        <div className="text-xs inline-block px-3 py-1.5 bg-gray-800 text-white rounded-full">
          Row 1 (bottom)
        </div>
      </div>
    </div>
  );
};

export default BrickVisualizer; 