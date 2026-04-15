import React, { useCallback, useRef, useState } from 'react';

import { formatFileSize } from '../../utils/fileValidation';

type FileUploadInputProps = {
  accept: string;
  maxSize: number; // in MB
  onFileSelect: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
};

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  accept,
  maxSize,
  onFileSelect,
  error,
  disabled = false,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (file: File | null) => {
      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(null);
    // Reset input value to allow re-selecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const acceptExtensions = accept.split(',').join(', ');

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-zone ${isDragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={selectedFile ? `Selected file: ${selectedFile.name}` : 'Upload file'}
        aria-disabled={disabled}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          disabled={disabled}
          aria-label="File input"
        />

        {!selectedFile ? (
          <div className="file-upload-prompt">
            <svg
              className="file-upload-icon"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="file-upload-text">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="file-upload-hint">
              {acceptExtensions} (max {maxSize}MB)
            </p>
          </div>
        ) : (
          <div className="file-preview">
            <svg
              className="file-icon"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
            <div className="file-info">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="file-remove-btn"
              aria-label="Remove file"
              disabled={disabled}
            >
              ×
            </button>
          </div>
        )}
      </div>

      {error && <p className="file-upload-error">{error}</p>}
    </div>
  );
};
