/**
 * File encoding utilities for converting files to Base64 and handling file data
 */

/**
 * Convert a file to Base64 string
 * Removes the data URL prefix to get pure Base64
 *
 * @param file - File to convert
 * @returns Promise that resolves to Base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/mpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Convert a file to Data URL (for image previews)
 * Keeps the data URL prefix for direct use in img src
 *
 * @param file - File to convert
 * @returns Promise that resolves to Data URL string
 */
export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Sanitize a filename to remove potentially dangerous characters
 * Replaces unsafe characters with underscores
 *
 * @param filename - Original filename
 * @returns Sanitized filename safe for storage
 */
export function sanitizeFileName(filename: string): string {
  // Replace any character that is not alphanumeric, dot, dash, or underscore
  return filename.replace(/[^a-z0-9._-]/gi, '_');
}

/**
 * Estimate the Base64 size of a file
 * Base64 encoding increases size by approximately 33%
 *
 * @param file - File to estimate
 * @returns Estimated Base64 size in bytes
 */
export function estimateBase64Size(file: File): number {
  // Base64 encoding overhead: roughly 4/3 of original size
  return Math.ceil((file.size * 4) / 3);
}

/**
 * Check if estimated payload size is within Apps Script limit
 *
 * @param files - Array of files to check
 * @returns Object with isWithinLimit boolean and estimatedSize in MB
 */
export function checkPayloadSize(files: File[]): {
  isWithinLimit: boolean;
  estimatedSizeMB: number;
} {
  const APPS_SCRIPT_LIMIT = 50 * 1024 * 1024; // 50MB

  const totalEstimatedSize = files.reduce((sum, file) => sum + estimateBase64Size(file), 0);

  return {
    isWithinLimit: totalEstimatedSize <= APPS_SCRIPT_LIMIT,
    estimatedSizeMB: totalEstimatedSize / (1024 * 1024),
  };
}
