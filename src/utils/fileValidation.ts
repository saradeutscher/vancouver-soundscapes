/**
 * File validation utilities for audio and image uploads
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Accepted audio MIME types
const AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a'];

// Accepted image MIME types
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Audio file extensions
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a'];

// Image file extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Validate an audio file
 *
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in megabytes
 * @returns Validation result with error message if invalid
 */
export function validateAudioFile(file: File, maxSizeMB: number): ValidationResult {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type by MIME type
  if (!isValidFileType(file, AUDIO_TYPES)) {
    return {
      valid: false,
      error: 'Please upload an audio file (.mp3, .wav, or .m4a)',
    };
  }

  // Check file extension as additional validation
  const extension = getFileExtension(file.name);
  if (!AUDIO_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Invalid audio file extension: ${extension}. Please use ${AUDIO_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Audio file must be under ${maxSizeMB}MB. Current size: ${formatFileSize(file.size)}`,
    };
  }

  return { valid: true };
}

/**
 * Validate an image file
 *
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in megabytes
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File, maxSizeMB: number): ValidationResult {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type by MIME type
  if (!isValidFileType(file, IMAGE_TYPES)) {
    return {
      valid: false,
      error: 'Please upload an image file (.jpg, .png, or .webp)',
    };
  }

  // Check file extension as additional validation
  const extension = getFileExtension(file.name);
  if (!IMAGE_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Invalid image file extension: ${extension}. Please use ${IMAGE_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Image file must be under ${maxSizeMB}MB. Current size: ${formatFileSize(file.size)}`,
    };
  }

  return { valid: true };
}

/**
 * Check if a file's MIME type is in the list of accepted types
 *
 * @param file - File to check
 * @param acceptedTypes - Array of accepted MIME types
 * @returns true if file type is accepted
 */
export function isValidFileType(file: File, acceptedTypes: string[]): boolean {
  return acceptedTypes.includes(file.type);
}

/**
 * Get file extension from filename (including the dot)
 *
 * @param filename - Name of the file
 * @returns File extension in lowercase (e.g., '.mp3')
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Format file size in bytes to human-readable format
 *
 * @param bytes - File size in bytes
 * @returns Formatted file size (e.g., '2.5 MB')
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
