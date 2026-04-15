import React, { useState } from 'react';

import { FileUploadInput } from '../components/form/FileUploadInput';
import { MultiImageUploadInput } from '../components/form/MultiImageUploadInput';
import { UploadProgressIndicator } from '../components/form/UploadProgressIndicator';
import { MapLocationPicker } from '../components/map/MapLocationPicker';
import {
  serializePoint,
  serializePath,
  deserializePath,
  isValidCoordinate,
  getLatLng,
  type LatLng,
} from '../utils/coordinates';
import { fileToBase64 } from '../utils/fileEncoding';
import { validateAudioFile, validateImageFile } from '../utils/fileValidation';

// Google Apps Script deployment URL
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz8iQTGbrHEXOQn1E_HkeOEugzEzGwBZH_ppf9y3Cb5ALAm33gduFr67Ljm0XycaqX4HA/exec';

type SubmissionData = {
  name: string;
  description: string;
  audioLink: string;
  coordinates: string; // JSON string: "[lng,lat]" or "[[lng,lat],...]"
  locationType: 'Point' | 'LineString';
  year: number;
  categories: string[];
  themes: string[];
  notes: string;
  imageLinks: string;
  submitterName: string;
  submitterEmail: string;
};

// Utility functions
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const SubmitSound: React.FC = () => {
  const [formData, setFormData] = useState<SubmissionData>({
    name: '',
    description: new Date().toISOString().slice(0, 16),
    audioLink: '',
    coordinates: '',
    locationType: 'Point',
    year: 2026,
    categories: [],
    themes: [],
    notes: '',
    imageLinks: '',
    submitterName: '',
    submitterEmail: '',
  });

  const [pathPoints, setPathPoints] = useState<LatLng[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationTypeModal, setShowLocationTypeModal] = useState(false);
  const [pendingLocationType, setPendingLocationType] = useState<'Point' | 'LineString'>('Point');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // File upload state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // Handle field changes
  const handleChange = (field: keyof SubmissionData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle map location selection (single point)
  const handleMapLocation = (lat: number, lng: number) => {
    const coordinates = serializePoint(lat, lng);
    setFormData(prev => ({
      ...prev,
      coordinates,
    }));
    setPathPoints([]);
    // setIsMapOpen(false);
  };

  // Handle path selection (multiple points)
  const handlePathSelect = (points: LatLng[]) => {
    const coordinates = serializePath(points);
    setFormData(prev => ({
      ...prev,
      coordinates,
    }));
    setPathPoints(points);
    // setIsMapOpen(false);
  };

  // Handle location type change with confirmation
  const handleLocationTypeChange = (newType: 'Point' | 'LineString') => {
    if (formData.coordinates && newType !== formData.locationType) {
      setPendingLocationType(newType);
      setShowLocationTypeModal(true);
    } else {
      setFormData(prev => ({ ...prev, locationType: newType }));
    }
  };

  // Confirm location type change and clear data
  const confirmLocationTypeChange = () => {
    setFormData(prev => ({
      ...prev,
      locationType: pendingLocationType,
      coordinates: '',
    }));
    setPathPoints([]);
    setShowLocationTypeModal(false);
  };

  // Handle clearing location
  const handleClearLocation = () => {
    setFormData(prev => ({ ...prev, coordinates: '' }));
    setPathPoints([]);
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Sound name is required';
    }

    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = 'Date is required';
    }

    // Validate audio file
    if (!audioFile) {
      newErrors.audioFile = 'Audio recording is required';
    }

    // Validate audio file if present
    if (audioFile) {
      const validation = validateAudioFile(audioFile, 50);
      if (!validation.valid) {
        newErrors.audioFile = validation.error || 'Invalid audio file';
      }
    }

    // Validate each image file
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const validation = validateImageFile(file, 10);
        if (!validation.valid) {
          newErrors.imageFiles = `${file.name}: ${validation.error || 'Invalid image file'}`;
          break;
        }
      }
    }

    // Validate coordinates
    if (!formData.coordinates) {
      newErrors.location = 'Location is required';
    } else {
      try {
        if (formData.locationType === 'Point') {
          const { lat, lng } = getLatLng(formData.coordinates);
          if (!isValidCoordinate(lat, lng)) {
            newErrors.location = 'Invalid coordinates';
          }
        } else {
          // LineString validation
          const points = deserializePath(formData.coordinates);
          if (points.length < 2) {
            newErrors.location = 'Path must have at least 2 points';
          } else if (points.length > 50) {
            newErrors.location = 'Path cannot exceed 50 points';
          } else {
            // Validate each point
            const invalidPoint = points.find(p => !isValidCoordinate(p.lat, p.lng));
            if (invalidPoint) {
              newErrors.location = 'One or more path points have invalid coordinates';
            }
          }
        }
      } catch {
        newErrors.location = 'Invalid coordinate format';
      }
    }

    if (!formData.submitterEmail.trim()) {
      newErrors.submitterEmail = 'Your email is required';
    } else if (!isValidEmail(formData.submitterEmail)) {
      newErrors.submitterEmail = 'Please enter a valid email';
    }

    if (!agreedToTerms) {
      newErrors.agreement = 'You must agree to the submission terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);
    setUploadError('');

    try {
      // Build base payload
      const payload: Record<string, unknown> = {
        name: formData.name,
        description: formData.description,
        year: formData.year,
        locationType: formData.locationType,
        coordinates: formData.coordinates,
        categories: formData.categories,
        themes: formData.themes,
        notes: formData.notes,
        submitterName: formData.submitterName,
        submitterEmail: formData.submitterEmail,
        audioLink: formData.audioLink,
        imageLinks: formData.imageLinks,
      };

      // Add audio file data if file is selected
      if (audioFile) {
        const base64 = await fileToBase64(audioFile);
        payload.audioFileData = {
          fileName: audioFile.name,
          base64Data: base64,
          mimeType: audioFile.type,
          size: audioFile.size,
        };
      }

      // Add image files data if files are selected
      if (imageFiles.length > 0) {
        const base64Array = await Promise.all(imageFiles.map(f => fileToBase64(f)));
        payload.imageFilesData = imageFiles.map((file, i) => ({
          fileName: file.name,
          base64Data: base64Array[i],
          mimeType: file.type,
          size: file.size,
        }));
      }

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // no-cors mode doesn't allow reading response, but if no error thrown, submission succeeded
      console.log('Form submitted successfully');
      alert('Thank you! Your submission has been received and will be reviewed shortly.');

      // Reset form
      setFormData({
        name: '',
        description: '',
        audioLink: '',
        coordinates: '',
        locationType: 'Point',
        year: new Date().getFullYear(),
        categories: [],
        themes: [],
        notes: '',
        imageLinks: '',
        submitterName: '',
        submitterEmail: '',
      });
      setPathPoints([]);
      setAudioFile(null);
      setImageFiles([]);
      setAgreedToTerms(false);
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage =
        'There was an error submitting your recording. Please try again or contact us directly.';
      setUploadError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="submit-page">
      <div className="submit-header">
        <h1>Submit a Sound Recording</h1>
        <p>
          Fill out the form below to submit a recording to be considered as an addition to the map.
        </p>
      </div>

      <form className="submit-form" onSubmit={handleSubmit}>
        {/* Section 1: Sound Information */}
        <div className="form-section">
          <h2>Sound Information</h2>

          <div className="form-field">
            <label htmlFor="name">Sound Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g., Stanley Park Railway"
              required
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="description-date">Date *</label>
            <input
              type="date"
              id="description-date"
              value={formData.description.slice(0, 10)}
              onChange={e => {
                const date = e.target.value;
                const time = formData.description.slice(11, 16) || '12:00';
                handleChange('description', `${date}T${time}`);
              }}
              required
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="description-time">Time (Optional)</label>
            <input
              type="time"
              id="description-time"
              value={formData.description.slice(11, 16) || ''}
              onChange={e => {
                const date = formData.description.slice(0, 10);
                const time = e.target.value || '12:00';
                handleChange('description', `${date}T${time}`);
              }}
            />
            <p className="field-hint">
              Leave blank if you don&apos;t know the exact time of the recording
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="audio-upload">Audio Recording *</label>
            <FileUploadInput
              accept=".mp3,.wav,.m4a"
              maxSize={50}
              onFileSelect={setAudioFile}
              error={errors.audioFile}
              disabled={isUploading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="year">Year</label>
            <input
              type="number"
              id="year"
              value={formData.year}
              onChange={e => handleChange('year', e.target.value)}
              min="1900"
              max="2050"
              step="1"
            />
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="form-section">
          <h2>Location *</h2>

          <div className="form-field">
            <label htmlFor="locationType">Recording Type</label>
            <select
              id="locationType"
              value={formData.locationType}
              onChange={e => handleLocationTypeChange(e.target.value as 'Point' | 'LineString')}
            >
              <option value="Point">Point (Single Location)</option>
              <option value="LineString">Soundwalk (Multiple Points)</option>
            </select>
            <p className="field-hint">
              Select &quot;Point&quot; for a recording at one location, or &quot;Soundwalk&quot; for
              a recording along a path.
            </p>
          </div>

          {formData.locationType === 'LineString' && (
            <div className="path-instructions">
              Click multiple points on the map to create a walking path. Add at least 2 points to
              represent your soundwalk route.
            </div>
          )}

          {formData.coordinates && (
            <div className="selected-location">
              <div className="selected-location-info">
                {formData.locationType === 'Point' ? (
                  <>
                    <strong>Location:</strong>{' '}
                    {(() => {
                      const { lat, lng } = getLatLng(formData.coordinates);
                      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                    })()}
                  </>
                ) : (
                  <>
                    <strong>Path:</strong> {pathPoints.length} points
                  </>
                )}
              </div>
              <button type="button" onClick={handleClearLocation} className="clear-location-btn">
                Clear
              </button>
            </div>
          )}

          <MapLocationPicker
            mode={formData.locationType === 'Point' ? 'single' : 'path'}
            onLocationSelect={handleMapLocation}
            onPathSelect={handlePathSelect}
            initialLat={
              formData.coordinates && formData.locationType === 'Point'
                ? getLatLng(formData.coordinates).lat
                : undefined
            }
            initialLng={
              formData.coordinates && formData.locationType === 'Point'
                ? getLatLng(formData.coordinates).lng
                : undefined
            }
            initialPath={
              formData.coordinates && formData.locationType === 'LineString'
                ? pathPoints
                : undefined
            }
          />

          {errors.location && <span className="error">{errors.location}</span>}
        </div>

        {/* Section 3: Classification */}
        <div className="form-section">
          <h2>Classification (Optional)</h2>

          <fieldset className="form-field">
            <legend>Class</legend>
            <div className="checkbox-group">
              {['effects', 'ambience', 'soundwalk', 'events', 'scenes', 'dialogue'].map(cat => (
                <label key={cat} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={formData.categories.includes(cat)}
                    onChange={e => {
                      const newCategories = e.target.checked
                        ? [...formData.categories, cat]
                        : formData.categories.filter(c => c !== cat);
                      handleChange('categories', newCategories);
                    }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="form-field">
            <legend>Themes</legend>
            <div className="checkbox-group">
              {[
                'nature',
                'cityscape',
                'transport',
                'tourism',
                'people',
                'festivals',
                'events',
                'industrial',
                'culture',
                'commerce',
                'sports',
              ].map(theme => (
                <label key={theme} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={theme}
                    checked={formData.themes.includes(theme)}
                    onChange={e => {
                      const newThemes = e.target.checked
                        ? [...formData.themes, theme]
                        : formData.themes.filter(t => t !== theme);
                      handleChange('themes', newThemes);
                    }}
                  />
                  {theme}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Section 4: Additional Details */}
        <div className="form-section">
          <h2>Additional Details (Optional)</h2>

          <div className="form-field">
            <label htmlFor="notes">Recording Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={e => handleChange('notes', e.target.value)}
              rows={4}
              placeholder="Optionally describe what you hear in the recording, environmental conditions, notable sound events, etc."
            />
          </div>

          <div className="form-field">
            <label htmlFor="image-upload">Images</label>
            <MultiImageUploadInput
              accept=".jpg,.jpeg,.png,.webp"
              maxSize={10}
              maxFiles={5}
              onFilesChange={setImageFiles}
              error={errors.imageFiles}
              disabled={isUploading}
            />
          </div>
        </div>

        {/* Section 5: Submitter Information */}
        <div className="form-section">
          <h2>Your Information (Optional)</h2>

          <div className="form-field">
            <label htmlFor="submitterName">Your Name</label>
            <input
              type="text"
              id="submitterName"
              value={formData.submitterName}
              onChange={e => handleChange('submitterName', e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="form-field">
            <label htmlFor="submitterEmail">Your Email</label>
            <input
              type="email"
              id="submitterEmail"
              value={formData.submitterEmail}
              onChange={e => handleChange('submitterEmail', e.target.value)}
              placeholder="your.email@example.com"
            />
            {errors.submitterEmail && <span className="error">{errors.submitterEmail}</span>}
            <p className="field-hint">
              This will be used to contact you about your submission if there are any issues or
              questions.
            </p>
          </div>
        </div>

        {/* Section 6: Submission Agreement */}
        <div className="form-section">
          <h2>Submission Terms *</h2>
          <div className="submission-agreement">
            <p>By submitting audio and images, you agree that:</p>
            <ol className="agreement-terms">
              <li>
                <strong>Ownership:</strong> You are the copyright holder or have permission to share
                this content.
              </li>
              <li>
                <strong>License Grant:</strong> You grant Vancouver Soundscapes a non-exclusive,
                perpetual license to:
                <ul>
                  <li>Store and preserve your submission</li>
                  <li>Display on the public website</li>
                  <li>Create derivative works (format conversions, thumbnails)</li>
                  <li>Include in academic research and teaching</li>
                </ul>
              </li>
              <li>
                <strong>Attribution:</strong> Your name will be credited unless you opt out.
              </li>
              <li>
                <strong>Usage:</strong> Content will be shared under{' '}
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CC BY-NC-SA 4.0 license
                </a>
                .
              </li>
              <li>
                <strong>Privacy:</strong> No personally identifiable information will be shared
                without consent.
              </li>
              <li>
                <strong>Withdrawal:</strong> You may request removal of your submission at any time.
              </li>
            </ol>

            <div className="form-field agreement-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => {
                    setAgreedToTerms(e.target.checked);
                    if (errors.agreement && e.target.checked) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.agreement;
                        return newErrors;
                      });
                    }
                  }}
                  required
                />
                <span>I agree to these submission terms</span>
              </label>
              {errors.agreement && <span className="error">{errors.agreement}</span>}
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Sound Recording'}
          </button>
          <p className="submit-note">
            * Required fields. Your submission will be reviewed before being added to the map.
          </p>
        </div>
      </form>

      {/* Upload Progress Indicator */}
      <UploadProgressIndicator
        isUploading={isUploading}
        uploadingFiles={[audioFile?.name, ...imageFiles.map(f => f.name)]}
        error={uploadError}
      />

      {/* Location Type Change Confirmation Modal */}
      {showLocationTypeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="lightbox-overlay"
          style={{ zIndex: 10000 }}
        >
          <button
            type="button"
            onClick={() => setShowLocationTypeModal(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'default',
            }}
            aria-label="Close modal"
          />
          <div
            className="modal-content"
            style={{
              position: 'relative',
              zIndex: 1,
              background: 'white',
              padding: '32px',
              borderRadius: '8px',
              maxWidth: '500px',
              textAlign: 'center',
            }}
          >
            <h3 id="modal-title" style={{ marginTop: 0, color: 'var(--color-text-primary)' }}>
              Change Location Type?
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Changing the recording type will clear your current location selection. Do you want to
              continue?
            </p>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                marginTop: '24px',
              }}
            >
              <button
                type="button"
                onClick={() => setShowLocationTypeModal(false)}
                style={{
                  padding: '10px 24px',
                  background: 'transparent',
                  border: '1px solid var(--color-border-dark)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLocationTypeChange}
                style={{
                  padding: '10px 24px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
