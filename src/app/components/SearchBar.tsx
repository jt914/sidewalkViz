"use client";

import React, { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on desktop
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // For immediate search on type
    if (e.target.value === '') {
      onSearch('');
    }
  };

  return (
    <div className="search-container">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        Search Bricks
      </h3>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative flex border transition-all duration-200 
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
          bg-white rounded-md overflow-hidden
        `}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search brick text..."
            className="flex-grow px-3 py-2 border-none outline-none focus:ring-0"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
          <button
            type="submit"
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>
      </form>
      <p className="text-xs text-gray-500 mt-2 hidden md:block">
        Search by name, text, or other brick content
      </p>
    </div>
  );
};

export default SearchBar; 