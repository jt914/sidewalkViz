"use client";

import React, { useState, useRef } from 'react';

interface FileUploaderProps {
  onDataLoaded: (data: Record<string, string>) => void;
  defaultData: Record<string, string>;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded, defaultData }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        
        // Basic validation: Check if it's an object with string keys and values
        if (typeof jsonData !== 'object' || jsonData === null || Array.isArray(jsonData)) {
          throw new Error("Invalid JSON format. Expected an object.");
        }

        // Check if it follows the expected format (position keys with text values)
        const isValidFormat = Object.keys(jsonData).every(key => {
          const isValidKey = /^\d+-\d+$/.test(key);
          const isValidValue = typeof jsonData[key] === 'string';
          return isValidKey && isValidValue;
        });

        if (!isValidFormat) {
          throw new Error("Invalid data format. Expected position keys (e.g., '1-1') with text values.");
        }

        setTimeout(() => {
          onDataLoaded(jsonData);
          setSuccess("Data loaded successfully!");
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setIsProcessing(false);
        }, 800); // Add delay for animation
      } catch (err) {
        setTimeout(() => {
          setError((err as Error).message || "Failed to parse JSON file.");
          setIsProcessing(false);
        }, 500);
      }
    };

    reader.onerror = () => {
      setTimeout(() => {
        setError("Error reading file.");
        setIsProcessing(false);
      }, 500);
    };

    reader.readAsText(file);
  };

  const handleReset = () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    
    setTimeout(() => {
      onDataLoaded(defaultData);
      setSuccess("Reset to default data.");
      setIsProcessing(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 800);
  };

  return (
    <div className="file-uploader">
      <div 
        className={`
          border-2 border-dashed rounded-lg p-4 mb-4 text-center
          transition-all duration-300 ease-in-out
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center mb-2">
          <svg className="w-8 h-8 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
        </div>
        
        <label className="block w-full cursor-pointer">
          <span className="text-sm">
            {dragActive ? 'Drop your JSON file here' : 'Drag & drop your JSON file or click to browse'}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      
      <div className="mb-4">
        <button
          onClick={handleReset}
          className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center justify-center gap-2"
          disabled={isProcessing}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Reset to Default Data
        </button>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm flex items-start animate-fadeIn">
          <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm flex items-start animate-fadeIn">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{success}</span>
        </div>
      )}
      
      {isProcessing && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm flex items-center animate-pulse">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      )}
      
      <div className="mt-3 p-2 text-xs text-gray-500 border-t border-gray-200 pt-3">
        <p className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Format: JSON with position keys (e.g., &quot;1-1&quot;) and text values
        </p>
      </div>
    </div>
  );
};

export default FileUploader; 