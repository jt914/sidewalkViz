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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

        onDataLoaded(jsonData);
        setSuccess("Data loaded successfully!");
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        setError((err as Error).message || "Failed to parse JSON file.");
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError("Error reading file.");
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleReset = () => {
    onDataLoaded(defaultData);
    setSuccess("Reset to default data.");
    setError(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-uploader">
      <h3 className="text-lg font-semibold mb-2">Data Source</h3>
      
      <div className="flex flex-col gap-2">
        <label className="flex items-center justify-center w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-none cursor-pointer transition-colors">
          <span>Upload JSON File</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-black text-white rounded-none transition-colors"
          disabled={isProcessing}
        >
          Reset to Default Data
        </button>
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-100 border border-red-500 text-red-800 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-3 p-2 bg-green-100 border border-green-500 text-green-800 text-sm">
          {success}
        </div>
      )}
      
      {isProcessing && (
        <div className="mt-3 p-2 text-center">
          <span className="text-sm">Processing...</span>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-600">
        <p>File format: JSON with position keys (e.g., "1-1") and text values</p>
      </div>
    </div>
  );
};

export default FileUploader; 