"use client";

import React, { useRef, useEffect } from 'react';

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
  
  // Scroll to highlighted brick if specified
  useEffect(() => {
    if (currentHighlightPos && highlightedBrickRef.current) {
      highlightedBrickRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
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
    
    return (
      <div 
        key={key}
        ref={isCurrentHighlight ? highlightedBrickRef : null}
        className={`
          ${isEmpty ? 'empty-brick' : 'brick'} 
          ${highlight ? 'highlight' : ''}
          ${isCurrentHighlight ? 'current-highlight' : ''}
          w-full h-16 p-2 text-center flex items-center justify-center text-xs
          ${!isEmpty ? 'cursor-pointer' : ''}
        `}
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

  return (
    <div className="brick-visualizer h-full flex flex-col">
      <div className="text-center mb-2">
        <div className="text-xs inline-block px-2 py-1 bg-black text-white">
          Row {maxRow} (top)
        </div>
      </div>
      
      <div className="vertical-bricks overflow-y-auto flex-grow border border-black">
        {rows}
      </div>
      
      <div className="text-center mt-2">
        <div className="text-xs inline-block px-2 py-1 bg-black text-white">
          Row 1 (bottom)
        </div>
      </div>
    </div>
  );
};

export default BrickVisualizer; 