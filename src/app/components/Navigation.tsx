"use client";

import React, { useState } from 'react';

interface NavigationProps {
  currentRow: number;
  maxRow: number;
  onNavigate: (direction: "up" | "down" | "top" | "bottom" | number) => void;
  compact?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  currentRow,
  maxRow,
  onNavigate,
  compact = false,
}) => {
  const [jumpToRow, setJumpToRow] = useState<string>('');
  const [animatingButton, setAnimatingButton] = useState<string | null>(null);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rowNumber = parseInt(jumpToRow);
    if (!isNaN(rowNumber) && rowNumber >= 1 && rowNumber <= maxRow) {
      onNavigate(rowNumber);
      setJumpToRow('');
    }
  };

  const handleButtonClick = (direction: "up" | "down" | "top" | "bottom") => {
    setAnimatingButton(direction);
    onNavigate(direction);
    setTimeout(() => setAnimatingButton(null), 300);
  };

  if (compact) {
    return (
      <div className="navigation-container">
        <div className="flex gap-1">
          <button
            onClick={() => handleButtonClick("bottom")}
            className={`
              flex-1 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-l 
              transition-all text-sm shadow-sm flex items-center justify-center
              ${animatingButton === "bottom" ? "scale-95 opacity-90" : ""}
            `}
            title="Go to bottom row"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
          <button
            onClick={() => handleButtonClick("down")}
            className={`
              flex-1 p-2 bg-blue-500 hover:bg-blue-600 text-white
              transition-all text-xl flex items-center justify-center
              ${currentRow === 1 ? "opacity-50 cursor-not-allowed" : ""}
              ${animatingButton === "down" ? "scale-95 opacity-90" : ""}
            `}
            disabled={currentRow === 1}
            title="Move down 4 rows"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <form onSubmit={handleJumpSubmit} className="flex-1 flex">
            <input
              type="number"
              min="1"
              max={maxRow}
              value={jumpToRow}
              onChange={(e) => setJumpToRow(e.target.value)}
              placeholder="Row #"
              className="w-full py-2 px-1 text-center text-sm border-y border-l border-gray-200 focus:ring-0 focus:border-blue-300"
            />
            <button
              type="submit"
              className="px-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors border-y border-r border-blue-500"
            >
              Go
            </button>
          </form>
          <button
            onClick={() => handleButtonClick("up")}
            className={`
              flex-1 p-2 bg-blue-500 hover:bg-blue-600 text-white
              transition-all text-xl flex items-center justify-center
              ${currentRow === maxRow ? "opacity-50 cursor-not-allowed" : ""}
              ${animatingButton === "up" ? "scale-95 opacity-90" : ""}
            `}
            disabled={currentRow === maxRow}
            title="Move up 4 rows"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
          </button>
          <button
            onClick={() => handleButtonClick("top")}
            className={`
              flex-1 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r
              transition-all text-sm shadow-sm flex items-center justify-center
              ${animatingButton === "top" ? "scale-95 opacity-90" : ""}
            `}
            title="Go to top row"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="navigation-container">
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => handleButtonClick("top")}
          className={`
            px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded
            transition-all flex items-center justify-center gap-1
            ${animatingButton === "top" ? "scale-95 opacity-90" : ""}
          `}
          title="Go to top row"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
          Top
        </button>
        <button
          onClick={() => handleButtonClick("bottom")}
          className={`
            px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded
            transition-all flex items-center justify-center gap-1
            ${animatingButton === "bottom" ? "scale-95 opacity-90" : ""}
          `}
          title="Go to bottom row"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          Bottom
        </button>
        <button
          onClick={() => handleButtonClick("up")}
          className={`
            px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded
            transition-all flex items-center justify-center gap-1
            ${currentRow === maxRow ? "opacity-50 cursor-not-allowed" : ""}
            ${animatingButton === "up" ? "scale-95 opacity-90" : ""}
          `}
          disabled={currentRow === maxRow}
          title="Move up 4 rows"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
          </svg>
          Up 4 Rows
        </button>
        <button
          onClick={() => handleButtonClick("down")}
          className={`
            px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded
            transition-all flex items-center justify-center gap-1
            ${currentRow === 1 ? "opacity-50 cursor-not-allowed" : ""}
            ${animatingButton === "down" ? "scale-95 opacity-90" : ""}
          `}
          disabled={currentRow === 1}
          title="Move down 4 rows"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
          Down 4 Rows
        </button>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-gray-500 mb-1">Jump to specific row:</div>
        <form onSubmit={handleJumpSubmit} className="flex">
          <input
            type="number"
            min="1"
            max={maxRow}
            value={jumpToRow}
            onChange={(e) => setJumpToRow(e.target.value)}
            placeholder="Enter row number..."
            className="flex-grow px-3 py-2 rounded-l border border-gray-200 focus:border-blue-300 focus:ring-0"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r transition-colors"
          >
            Go
          </button>
        </form>
      </div>
      
      <div className="text-center">
        <div className="py-2 px-4 bg-gray-100 border border-gray-200 rounded text-center">
          <div className="text-xs text-gray-500 mb-1">Current Position</div>
          <div className="text-lg font-medium">
            Row <span className="text-blue-600">{currentRow}</span> of {maxRow}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation; 