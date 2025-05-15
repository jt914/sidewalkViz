"use client";

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
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
      <h3 className="text-lg font-semibold mb-2 hidden md:block">Search Bricks</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search brick text..."
          className="flex-grow px-3 py-2 rounded-none border border-black focus:outline-none focus:border-2"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-black text-white rounded-none hover:bg-brick-hover transition-colors"
        >
          Search
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-2 bg-gray-200 text-black rounded-none hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        )}
      </form>
      <p className="text-xs text-gray-600 mt-1 hidden md:block">
        Search by name, text, or other brick content
      </p>
    </div>
  );
};

export default SearchBar; 