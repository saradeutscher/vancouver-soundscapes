import React, { useState } from 'react';

import { MapLocationPicker } from '../components/map/MapLocationPicker';

// Google Apps Script deployment URL
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz8iQTGbrHEXOQn1E_HkeOEugzEzGwBZH_ppf9y3Cb5ALAm33gduFr67Ljm0XycaqX4HA/exec';

type SubmissionData = {
  name: string;
  description: string;
  audioLink: string;
  latitude: string;
  longitude: string;
  locationType: 'Point' | 'LineString';
  decade: string;
  categories: string[];
  themes: string[];
  notes: string;
  imageLinks: string;
  submitterName: string;
  submitterEmail: string;
};

// Utility functions
function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const SubmitSound: React.FC = () => {
  const [formData, setFormData] = useState<SubmissionData>({
    name: '',
    description: '',
    audioLink: '',
    latitude: '',
    longitude: '',
    locationType: 'Point',
    decade: '2020',
    categories: [],
    themes: [],
    notes: '',
    imageLinks: '',
    submitterName: '',
    submitterEmail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Handle map location selection
  const handleMapLocation = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
    setIsMapOpen(false);
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Sound name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.audioLink.trim()) {
      newErrors.audioLink = 'Audio file link is required';
    } else if (!isValidURL(formData.audioLink)) {
      newErrors.audioLink = 'Please enter a valid URL';
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Location is required';
    } else {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Invalid latitude (-90 to 90)';
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Invalid longitude (-180 to 180)';
      }
    }

    if (!formData.submitterEmail.trim()) {
      newErrors.submitterEmail = 'Your email is required';
    } else if (!isValidEmail(formData.submitterEmail)) {
      newErrors.submitterEmail = 'Please enter a valid email';
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

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          audioLink: formData.audioLink,
          decade: formData.decade,
          locationType: formData.locationType,
          latitude: formData.latitude,
          longitude: formData.longitude,
          categories: formData.categories,
          themes: formData.themes,
          notes: formData.notes,
          imageLinks: formData.imageLinks,
          submitterName: formData.submitterName,
          submitterEmail: formData.submitterEmail,
        }),
      });

      // no-cors mode doesn't allow reading response, but if no error thrown, submission succeeded
      console.log('Form submitted successfully');
      alert('Thank you! Your submission has been received and will be reviewed shortly.');

      // Reset form
      setFormData({
        name: '',
        description: '',
        audioLink: '',
        latitude: '',
        longitude: '',
        locationType: 'Point',
        decade: new Date().getFullYear().toString(),
        categories: [],
        themes: [],
        notes: '',
        imageLinks: '',
        submitterName: '',
        submitterEmail: '',
      });
    } catch (error) {
      console.error('Submission error:', error);
      alert(
        'There was an error submitting your recording. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-page">
      <div className="submit-header">
        <h1>Submit a Sound Recording</h1>
        <p>Fill out the form below to submit a recording for review to be added to the map.</p>
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
            <label htmlFor="description">Date & Time *</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="e.g., February 3, 2026 (Tuesday), 2:30 p.m."
              required
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="audioLink">Link to Audio File *</label>
            <input
              type="url"
              id="audioLink"
              value={formData.audioLink}
              onChange={e => handleChange('audioLink', e.target.value)}
              placeholder="https://drive.google.com/..."
              required
            />
            <p className="field-hint">
              Upload your audio file to Google Drive or another service and paste the share link
              here.
            </p>
            {errors.audioLink && <span className="error">{errors.audioLink}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="decade">Decade</label>
            <input
              type="number"
              id="decade"
              value={formData.decade}
              onChange={e => handleChange('decade', e.target.value)}
              min="1900"
              max="2020"
              step="10"
            />
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="form-section">
          <h2>Location *</h2>

          <div className="location-input-methods">
            <button
              type="button"
              onClick={() => setIsMapOpen(!isMapOpen)}
              className="map-toggle-btn"
            >
              {isMapOpen ? 'Hide Map' : 'Pick Location on Map'}
            </button>
          </div>

          {isMapOpen && (
            <MapLocationPicker
              onLocationSelect={handleMapLocation}
              initialLat={formData.latitude ? parseFloat(formData.latitude) : undefined}
              initialLng={formData.longitude ? parseFloat(formData.longitude) : undefined}
            />
          )}

          <div className="coordinate-inputs">
            <div className="form-field">
              <label htmlFor="latitude">Latitude *</label>
              <input
                type="text"
                id="latitude"
                value={formData.latitude}
                onChange={e => handleChange('latitude', e.target.value)}
                placeholder="49.2827"
                required
              />
              {errors.latitude && <span className="error">{errors.latitude}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="longitude">Longitude *</label>
              <input
                type="text"
                id="longitude"
                value={formData.longitude}
                onChange={e => handleChange('longitude', e.target.value)}
                placeholder="-123.1207"
                required
              />
              {errors.longitude && <span className="error">{errors.longitude}</span>}
            </div>
          </div>

          {errors.location && <span className="error">{errors.location}</span>}

          <div className="form-field">
            <label htmlFor="locationType">Recording Type</label>
            <select
              id="locationType"
              value={formData.locationType}
              onChange={e => handleChange('locationType', e.target.value as 'Point' | 'LineString')}
            >
              <option value="Point">Point (Single Location)</option>
              <option value="LineString">Soundwalk (Multiple Points)</option>
            </select>
            <p className="field-hint">
              Select &quot;Point&quot; for a recording at one location, or &quot;Soundwalk&quot; for
              a recording along a path.
            </p>
          </div>
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
            <label htmlFor="imageLinks">Image Links (comma-separated)</label>
            <input
              type="text"
              id="imageLinks"
              value={formData.imageLinks}
              onChange={e => handleChange('imageLinks', e.target.value)}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
            <p className="field-hint">
              Optional: Paste links to photos from the recording location, separated by commas.
            </p>
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
              We&apos;ll use this to contact you about your submission if there are any issues or
              questions.
            </p>
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
    </div>
  );
};
