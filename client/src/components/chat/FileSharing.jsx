import React, { useState, useRef } from 'react';
import { FaFile, FaImage, FaFileUpload, FaTimes, FaDownload } from 'react-icons/fa';

const FileSharing = ({ onSend }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendFile = () => {
    if (selectedFile) {
      onSend(selectedFile);
      clearFile();
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInput}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      {!selectedFile ? (
        <div
          className={`relative ${
            dragActive ? 'border-orange-500' : 'border-gray-300'
          } border-2 border-dashed rounded-lg p-4 transition-colors`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-2 text-gray-500">
            <FaFileUpload className="w-8 h-8" />
            <div className="text-sm text-center">
              <p>Drag and drop files here, or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                browse files
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {preview ? (
                <img src={preview} alt="Preview" className="w-12 h-12 rounded object-cover" />
              ) : (
                <FaFile className="w-8 h-8 text-orange-500" />
              )}
              <div>
                <div className="font-medium text-gray-700">{selectedFile.name}</div>
                <div className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <button
            onClick={sendFile}
            className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors flex items-center justify-center space-x-2"
          >
            <FaUpload className="w-4 h-4" />
            <span>Send File</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const FileMessage = ({ file, preview }) => {
  const handleDownload = () => {
    // Create a download link for the file
    const link = document.createElement('a');
    link.href = preview || URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg max-w-sm">
      {preview ? (
        <img src={preview} alt="Preview" className="w-16 h-16 rounded object-cover" />
      ) : (
        <FaFile className="w-8 h-8 text-orange-500" />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-700 truncate">{file.name}</div>
        <div className="text-sm text-gray-500">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="p-2 hover:bg-orange-100 rounded-full transition-colors"
        title="Download file"
      >
        <FaDownload className="w-5 h-5 text-orange-500" />
      </button>
    </div>
  );
};

export default FileSharing;
