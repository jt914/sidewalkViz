"use client";

import React, { useState, useEffect } from 'react';

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
  const [animated, setAnimated] = useState(false);
  
  // Add staggered animation effect when results change
  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!searchQuery.trim()) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white border border-gray-200 rounded">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <p>Enter a search term to find matching bricks</p>
      </div>
    );
  }

  // Find all matching results
  const results = Object.entries(data)
    .filter(entry => 
      entry[1].toLowerCase().includes(searchQuery.toLowerCase())
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
      
      // Create a snippet with highlighted match for display
      const snippetParts = [];
      if (index !== -1) {
        const before = snippet.substring(0, snippet.toLowerCase().indexOf(lowerQuery));
        const match = snippet.substring(before.length, before.length + searchQuery.length);
        const after = snippet.substring(before.length + match.length);
        
        snippetParts.push(before);
        snippetParts.push(<span key="highlight" className="font-bold bg-yellow-200">{match}</span>);
        snippetParts.push(after);
      } else {
        snippetParts.push(snippet);
      }
      
      return {
        position,
        row,
        col,
        text,
        snippet,
        snippetParts
      };
    })
    .sort((a, b) => a.row - b.row || a.col - b.col);

  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 border border-gray-200 rounded bg-white">
        <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p>No matching bricks found for &quot;{searchQuery}&quot;</p>
      </div>
    );
  }

  return (
    <div className="search-results overflow-hidden rounded border border-gray-200">
      <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h4 className="font-medium text-gray-700">
          Search Results
        </h4>
        <span className="search-highlight-count">
          {results.length}
        </span>
      </div>
      <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
        {results.map((result, index) => (
          <div 
            key={result.position}
            className={`
              search-result-item
              ${currentHighlight === result.position ? 'active' : ''}
              ${animated ? `animate-[fadeInUp_0.3s_ease_${0.05 * index}s_both]` : 'opacity-0'}
            `}
            onClick={() => onResultClick(result.position)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium flex items-center">
                <svg className="w-3 h-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
                Row {result.row}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">{getColumnName(result.col)}</span>
            </div>
            <p className="text-sm mt-1">{result.snippetParts}</p>
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