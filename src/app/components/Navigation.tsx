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

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rowNumber = parseInt(jumpToRow);
    if (!isNaN(rowNumber) && rowNumber >= 1 && rowNumber <= maxRow) {
      onNavigate(rowNumber);
      setJumpToRow('');
    }
  };

  if (compact) {
    return (
      <div className="navigation-container">
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate("bottom")}
            className="flex-1 p-2 bg-black text-white rounded-none transition-colors text-sm"
            title="Go to bottom row"
          >
            Bottom
          </button>
          <button
            onClick={() => onNavigate("down")}
            className="flex-1 p-2 bg-black text-white rounded-none transition-colors text-xl"
            disabled={currentRow === 1}
            title="Move down 4 rows"
          >
            ↓
          </button>
          <form onSubmit={handleJumpSubmit} className="flex-1 flex">
            <input
              type="number"
              min="1"
              max={maxRow}
              value={jumpToRow}
              onChange={(e) => setJumpToRow(e.target.value)}
              placeholder="Row #"
              className="w-full p-2 rounded-none bg-white text-black border border-black text-sm"
            />
            <button
              type="submit"
              className="px-2 bg-black text-white rounded-none transition-colors"
            >
              Go
            </button>
          </form>
          <button
            onClick={() => onNavigate("up")}
            className="flex-1 p-2 bg-black text-white rounded-none transition-colors text-xl"
            disabled={currentRow === maxRow}
            title="Move up 4 rows"
          >
            ↑
          </button>
          <button
            onClick={() => onNavigate("top")}
            className="flex-1 p-2 bg-black text-white rounded-none transition-colors text-sm"
            title="Go to top row"
          >
            Top
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="navigation-container">
      <h3 className="text-lg font-semibold mb-2">Navigation</h3>
      
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onNavigate("top")}
          className="flex-1 px-3 py-2 bg-black text-white rounded-none transition-colors"
          title="Go to top row"
        >
          Top
        </button>
        <button
          onClick={() => onNavigate("up")}
          className="flex-1 px-3 py-2 bg-black text-white rounded-none transition-colors"
          disabled={currentRow === maxRow}
          title="Move up 4 rows"
        >
          ↑
        </button>
        <button
          onClick={() => onNavigate("down")}
          className="flex-1 px-3 py-2 bg-black text-white rounded-none transition-colors"
          disabled={currentRow === 1}
          title="Move down 4 rows"
        >
          ↓
        </button>
        <button
          onClick={() => onNavigate("bottom")}
          className="flex-1 px-3 py-2 bg-black text-white rounded-none transition-colors"
          title="Go to bottom row"
        >
          Bottom
        </button>
      </div>
      
      <form onSubmit={handleJumpSubmit} className="flex gap-0">
        <input
          type="number"
          min="1"
          max={maxRow}
          value={jumpToRow}
          onChange={(e) => setJumpToRow(e.target.value)}
          placeholder="Jump to row..."
          className="flex-grow px-3 py-2 rounded-none bg-white text-black border border-black focus:outline-none"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-black text-white rounded-none transition-colors"
        >
          Go
        </button>
      </form>
      
      <div className="text-center mt-3">
        <span className="px-2 py-1 bg-black text-white rounded-none">
          Current row: {currentRow} of {maxRow}
        </span>
      </div>
    </div>
  );
};

export default Navigation; 