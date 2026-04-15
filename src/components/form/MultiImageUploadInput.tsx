import React, { useCallback, useRef, useState, useEffect } from 'react';

import { fileToDataURL } from '../../utils/fileEncoding';
import { formatFileSize } from '../../utils/fileValidation';

type MultiImageUploadInputProps = {
  accept: string;
  maxSize: number; // per file, in MB
  maxFiles: number;
  onFilesChange: (files: File[]) => void;
  error?: string;
  disabled?: boolean;
};

type ImagePreview = {
  file: File;
  preview: string;
};

export const MultiImageUploadInput: React.FC<MultiImageUploadInputProps> = ({
  accept,
  maxSize,
  maxFiles,
  onFilesChange,
  error,
  disabled = false,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate previews for selected files
  const generatePreviews = useCallback(async (files: File[]) => {
    const previews: ImagePreview[] = [];

    for (const file of files) {
      try {
        const preview = await fileToDataURL(file);
        previews.push({ file, preview });
      } catch (error) {
        console.error('Failed to generate preview:', error);
      }
    }

    return previews;
  }, []);

  const handleFilesChange = useCallback(
    async (files: File[]) => {
      const previews = await generatePreviews(files);
      setImagePreviews(previews);
      onFilesChange(files);
    },
    [generatePreviews, onFilesChange]
  );

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const limitedFiles = files.slice(0, maxFiles);
    await handleFilesChange(limitedFiles);
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const limitedFiles = files.slice(0, maxFiles);
    await handleFilesChange(limitedFiles);
  };

  const handleClick = () => {
    if (!disabled && imagePreviews.length < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = async (index: number) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    onFilesChange(newPreviews.map(p => p.file));

    // Reset input value to allow re-selecting files
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

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(({ preview }) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  const acceptExtensions = accept.split(',').join(', ');
  const canAddMore = imagePreviews.length < maxFiles;

  return (
    <div className="multi-image-upload-container">
      {imagePreviews.length > 0 && (
        <div className="image-upload-grid">
          {imagePreviews.map((imagePreview, index) => (
            <div key={index} className="image-upload-thumbnail">
              <img src={imagePreview.preview} alt={`Preview ${index + 1}`} />
              <div className="image-thumbnail-info">
                <p className="image-thumbnail-name">{imagePreview.file.name}</p>
                <p className="image-thumbnail-size">{formatFileSize(imagePreview.file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="image-remove-btn"
                aria-label={`Remove image ${index + 1}`}
                disabled={disabled}
              >
                ×
              </button>
            </div>
          ))}

          {canAddMore && (
            <div
              className={`image-upload-add-more ${isDragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={handleClick}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label="Add more images"
              aria-disabled={disabled}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <p>Add more</p>
            </div>
          )}
        </div>
      )}

      {imagePreviews.length === 0 && (
        <div
          className={`file-upload-zone ${isDragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Upload images"
          aria-disabled={disabled}
        >
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="file-upload-text">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="file-upload-hint">
              {acceptExtensions} (max {maxFiles} images, {maxSize}MB each)
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        multiple
        style={{ display: 'none' }}
        disabled={disabled}
        aria-label="Image file input"
      />

      {imagePreviews.length > 0 && (
        <p className="image-count-text">
          {imagePreviews.length} of {maxFiles} images selected
        </p>
      )}

      {error && <p className="file-upload-error">{error}</p>}
    </div>
  );
};
