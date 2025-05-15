"use client";

import React from 'react';

interface SearchResultsProps {
  data: Record<string, string>;
  searchQuery: string;
  currentHighlight: string | null;
  onResultClick: (position: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  data,
  searchQuery,
  currentHighlight,
  onResultClick
}) => {
  if (!searchQuery.trim()) {
    return (
      <div className="p-4 text-center text-gray-500">
        Enter a search term to find matching bricks
      </div>
    );
  }

  // Find all matching results
  const results = Object.entries(data)
    .filter(([_, text]) => 
      text.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(([position, text]) => {
      const [row, col] = position.split('-').map(Number);
      
      // Create a text snippet with highlighted match
      const lowerText = text.toLowerCase();
      const lowerQuery = searchQuery.toLowerCase();
      const index = lowerText.indexOf(lowerQuery);
      
      let snippet = text;
      if (text.length > 40) {
        // If text is long, create a snippet around the match
        const start = Math.max(0, index - 15);
        const end = Math.min(text.length, index + searchQuery.length + 15);
        snippet = (start > 0 ? '...' : '') + 
                 text.substring(start, end) + 
                 (end < text.length ? '...' : '');
      }
      
      return {
        position,
        row,
        col,
        text,
        snippet
      };
    })
    .sort((a, b) => a.row - b.row || a.col - b.col);

  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No matching bricks found for "{searchQuery}"
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="p-2 border-b border-black bg-gray-100">
        <p className="font-medium">Found {results.length} matching brick{results.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="max-h-[50vh] overflow-y-auto">
        {results.map((result) => (
          <div 
            key={result.position}
            className={`search-result-item ${currentHighlight === result.position ? 'active' : ''}`}
            onClick={() => onResultClick(result.position)}
          >
            <div className="flex justify-between">
              <span className="font-medium">Row {result.row}, Col {result.col}</span>
              <span className="text-xs text-gray-500">{getColumnName(result.col)}</span>
            </div>
            <p className="text-sm truncate">{result.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper to describe column locations
function getColumnName(col: number): string {
  switch (col) {
    case 0: return "Left";
    case 1: return "Left-center";
    case 2: return "Center";
    case 3: return "Right-center";
    case 4: return "Right";
    default: return "";
  }
}

export default SearchResults; 