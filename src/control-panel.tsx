import React, {useCallback, useState} from 'react';

import { CategoryData } from './Sounds';

type ControlPanelProps = {
  categories: Array<CategoryData>;
  themes: Array<CategoryData>;
  decades: Array<CategoryData>;
  types: Array<CategoryData>
  selectedCategory: string | null;
  selectedTheme: string | null;
  selectedDecade: number | null;
  selectedType: string | null;
  clusteringEnabled: boolean;
  onCategoryChange: (value: string | null) => void;
  onThemeChange: (value: string | null) => void;
  onDecadeChange: (value: number | null) => void;
  onTypeChange: (value: string | null) => void;
  onClusteringToggle: (enabled: boolean) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchResultCount?: number;
}

export const ControlPanel = ({
  categories,
  themes,
  decades,
  types,
  selectedCategory,
  selectedTheme,
  selectedDecade,
  selectedType,
  clusteringEnabled,
  onCategoryChange,
  onThemeChange,
  onDecadeChange,
  onTypeChange,
  onClusteringToggle,
  searchQuery,
  onSearchChange,
  searchResultCount
}: ControlPanelProps) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onTypeChange(e.target.value || null);
    },
    [onTypeChange]
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onCategoryChange(e.target.value || null);
    },
    [onCategoryChange]
  );

  const handleThemeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onThemeChange(e.target.value || null);
    },
    [onThemeChange]
  );

  const handleDecadeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onDecadeChange(Number(e.target.value) || null);
    },
    [onDecadeChange]
  );

  const handleReset = useCallback(() => {
    onDecadeChange(null);
    onTypeChange(null);
    onCategoryChange(null);
    onThemeChange(null);
    onSearchChange('');
  }, [onDecadeChange, onTypeChange, onCategoryChange, onThemeChange, onSearchChange]);

  return (
    <div className={`control-panel marker-clustering-control-panel ${isMinimized ? 'minimized' : ''}`}>
      <div className="control-panel-header">
        <h3>Filter the Map</h3>
        <button
          className="minimize-button"
          onClick={() => setIsMinimized(!isMinimized)}
          aria-label={isMinimized ? 'Expand panel' : 'Minimize panel'}
        >
          {isMinimized ? '+' : '-'}
        </button>
      </div>
      {!isMinimized && (
        <>
          <p>
            Use the controls below to filter the sounds shown on the map.
          </p>
          <div className="search-control">
            <div className="search-input-wrapper">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search the sounds..."
                className="search-input"
              />
            </div>
            {searchResultCount !== undefined && searchQuery && (
              <div className="search-result-count">
                ({searchResultCount} result{searchResultCount !== 1 ? 's' : ''})
              </div>
            )}
          </div>
          <p className="filter-options">
          <label> Filter by Decade:</label>{' '}
            <select value={selectedDecade ?? ''} onChange={handleDecadeChange}>
              <option value={''}>All sounds</option>

              {decades.map(decade => (
                <option key={decade.key} value={decade.key}>
                  {decade.label} ({decade.count})
                </option>
              ))}
            </select>

            <label> Filter by Type:</label>{' '}
            <select value={selectedType ?? ''} onChange={handleTypeChange}>
              <option value={''}>All sounds</option>

              {types.map(type => (
                <option key={type.key} value={type.key}>
                  {type.label} ({type.count})
                </option>
              ))}
            </select>

            <label> Filter by Class:</label>{' '}
            <select value={selectedCategory ?? ''} onChange={handleCategoryChange}>
              <option value={''}>All sounds</option>

              {categories.map(category => (
                <option key={category.key} value={category.key}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>

            <label> Filter by Theme:</label>{' '}
            <select value={selectedTheme ?? ''} onChange={handleThemeChange}>
              <option value={''}>All sounds</option>

              {themes.map(theme => (
                <option key={theme.key} value={theme.key}>
                  {theme.label} ({theme.count})
                </option>
              ))}
            </select>
          </p>
          <div className="clustering-toggle">
            <label>
              <input
                type="checkbox"
                checked={clusteringEnabled}
                onChange={(e) => onClusteringToggle(e.target.checked)}
              />
              Enable Marker Clustering
            </label>
          </div>
          <button id="filter-reset" onClick={handleReset}>Reset</button>
        </>
      )}
    </div>
  );
};