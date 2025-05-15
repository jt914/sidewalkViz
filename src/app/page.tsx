"use client";

import { useState, useEffect } from "react";
import BrickVisualizer from "./components/BrickVisualizer";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Navigation from "./components/Navigation";
import FileUploader from "./components/FileUploader";
import defaultData from "../data.json";

export default function Home() {
  const [data, setData] = useState<Record<string, string>>(defaultData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentHighlight, setCurrentHighlight] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Calculate max row for navigation
  const rowNumbers = Object.keys(data).map(key => parseInt(key.split('-')[0]));
  const maxRow = rowNumbers.length > 0 ? Math.max(...rowNumbers) : 0;
  
  // Calculate search match statistics
  const searchMatches = searchQuery ? 
    Object.values(data).filter(text => 
      text.toLowerCase().includes(searchQuery.toLowerCase())
    ).length : 0;

  // Set fade-in animation on load
  useEffect(() => {
    setFadeIn(true);
    
    // Simulate initial loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Add body scroll lock when sidebar is open on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleFileUpload = (newData: Record<string, string>) => {
    setLoading(true);
    setTimeout(() => {
      setData(newData);
      setShowUploader(false);
      setCurrentHighlight(null);
      setLoading(false);
    }, 400); // Add small delay for loading animation
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentHighlight(null);
  };

  const handleNavigate = (direction: "up" | "down" | "top" | "bottom" | number) => {
    let targetRow: number;
    
    if (direction === "top") {
      targetRow = maxRow;
    } else if (direction === "bottom") {
      targetRow = 1;
    } else if (typeof direction === "number") {
      targetRow = direction;
    } else {
      const currentRow = currentHighlight ? 
        parseInt(currentHighlight.split('-')[0]) : 
        (direction === "up" ? 1 : maxRow);
      
      targetRow = direction === "up" ? 
        Math.min(currentRow + 4, maxRow) : 
        Math.max(currentRow - 4, 1);
    }
    
    // Find the first filled brick position in the target row
    const colOrder = [2, 0, 4, 1, 3];
    for (const col of colOrder) {
      const key = `${targetRow}-${col}`;
      if (data[key]) {
        setCurrentHighlight(key);
        return;
      }
    }
    
    setCurrentHighlight(`${targetRow}-0`);
  };

  const handleResultClick = (position: string) => {
    setCurrentHighlight(position);
    setSidebarOpen(false); // Close mobile sidebar after selection
  };

  const handleBrickClick = (position: string) => {
    setCurrentHighlight(position);
  };

  return (
    <div className={`h-screen flex flex-col ${fadeIn ? 'fade-in' : 'opacity-0'}`}>
      <header className="bg-white border-b border-gray-200 p-2 flex justify-between items-center">
        <h1 className="text-xl font-bold text-center flex-grow">Vienna Sidewalk Brick Visualizer</h1>
        <button 
          className="md:hidden p-2 text-xl rounded-full hover:bg-gray-100 w-10 h-10 flex items-center justify-center sidebar-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? "×" : "☰"}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed on both mobile and desktop */}
        <aside className={`
          sidebar custom-scrollbar
          w-72 border-r border-gray-200
          md:relative md:block
          absolute top-0 bottom-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          h-full overflow-y-auto
        `}>
          <div className="p-4">
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} />
              {searchQuery && searchMatches > 0 && (
                <div className="flex justify-center mt-2">
                  <span className="search-highlight-count">
                    {searchMatches} match{searchMatches !== 1 ? 'es' : ''} found
                  </span>
                </div>
              )}
            </div>
            
            {searchQuery && (
              <div className="mb-6 search-results-container">
                <SearchResults 
                  data={data}
                  searchQuery={searchQuery}
                  currentHighlight={currentHighlight}
                  onResultClick={handleResultClick}
                />
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
                Navigation
              </h3>
              <Navigation 
                currentRow={currentHighlight ? parseInt(currentHighlight.split('-')[0]) : 1}
                maxRow={maxRow} 
                onNavigate={handleNavigate}
                compact={false}
              />
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
                Data Options
              </h3>
              <button 
                onClick={() => setShowUploader(!showUploader)}
                className="w-full px-4 py-2 bg-white hover:bg-gray-50 text-black border border-gray-300 transition-colors mb-2 rounded shadow-sm hover:shadow flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                </svg>
                {showUploader ? "Hide Uploader" : "Show Data Uploader"}
              </button>
            </div>
            
            {showUploader && (
              <div className="animate-fadeIn">
                <FileUploader onDataLoaded={handleFileUpload} defaultData={defaultData} />
              </div>
            )}
          </div>
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-30 z-30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content - scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="h-full p-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading data...</p>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded border border-gray-200 p-4 h-full">
                <BrickVisualizer 
                  data={data} 
                  searchQuery={searchQuery}
                  currentHighlightPos={currentHighlight || undefined}
                  onBrickClick={handleBrickClick}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
