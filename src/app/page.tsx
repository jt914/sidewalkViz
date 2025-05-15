"use client";

import { useState, useRef, useEffect } from "react";
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
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Calculate max row for navigation
  const rowNumbers = Object.keys(data).map(key => parseInt(key.split('-')[0]));
  const maxRow = rowNumbers.length > 0 ? Math.max(...rowNumbers) : 0;

  const handleFileUpload = (newData: Record<string, string>) => {
    setData(newData);
    setShowUploader(false);
    setCurrentHighlight(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentHighlight(null);
    setShowSearchResults(query.trim() !== '');
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
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-black p-2 flex justify-between items-center">
        <h1 className="text-xl font-bold text-center flex-grow">Vienna Sidewalk Brick Visualizer</h1>
        <button 
          className="md:hidden p-2 text-xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "×" : "☰"}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed on both mobile and desktop */}
        <aside className={`
          w-72 bg-white border-r border-black
          md:relative md:block
          absolute top-0 bottom-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          h-full overflow-y-auto
        `}>
          <div className="p-4">
            <div className="mb-4">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            {searchQuery && (
              <div className="mb-4">
                <SearchResults 
                  data={data}
                  searchQuery={searchQuery}
                  currentHighlight={currentHighlight}
                  onResultClick={handleResultClick}
                />
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Quick Navigation</h3>
              <Navigation 
                currentRow={currentHighlight ? parseInt(currentHighlight.split('-')[0]) : 1}
                maxRow={maxRow} 
                onNavigate={handleNavigate}
                compact={false}
              />
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Data Options</h3>
              <button 
                onClick={() => setShowUploader(!showUploader)}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black border border-black transition-colors mb-2"
              >
                {showUploader ? "Hide Uploader" : "Show Data Uploader"}
              </button>
            </div>
            
            {showUploader && (
              <FileUploader onDataLoaded={handleFileUpload} defaultData={defaultData} />
            )}
          </div>
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content - scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full p-2">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <p>Loading...</p>
              </div>
            ) : (
              <BrickVisualizer 
                data={data} 
                searchQuery={searchQuery}
                currentHighlightPos={currentHighlight || undefined}
                onBrickClick={handleBrickClick}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
