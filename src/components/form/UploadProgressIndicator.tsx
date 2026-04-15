import React from 'react';

type UploadProgressIndicatorProps = {
  isUploading: boolean;
  uploadingFiles: (string | undefined)[];
  error?: string;
};

export const UploadProgressIndicator: React.FC<UploadProgressIndicatorProps> = ({
  isUploading,
  uploadingFiles,
  error,
}) => {
  if (!isUploading) return null;

  const fileNames = uploadingFiles.filter((name): name is string => Boolean(name));

  return (
    <div
      className="upload-progress-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-progress-title"
    >
      <div className="upload-progress-content">
        {!error ? (
          <>
            <div className="upload-spinner" aria-label="Uploading files" />
            <h3 id="upload-progress-title" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
              Uploading Files...
            </h3>
            {fileNames.length > 0 && (
              <div className="upload-file-list">
                {fileNames.map((fileName, index) => (
                  <p key={index} className="upload-file-name">
                    {fileName}
                  </p>
                ))}
              </div>
            )}
            <p className="upload-progress-message">
              Please wait, this may take a moment for large files.
            </p>
          </>
        ) : (
          <>
            <div className="upload-error-icon" aria-label="Upload failed">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h3
              id="upload-progress-title"
              style={{ marginTop: '1rem', color: 'var(--color-error)' }}
            >
              Upload Failed
            </h3>
            <p className="upload-error-message">{error}</p>
          </>
        )}
      </div>
    </div>
  );
};
