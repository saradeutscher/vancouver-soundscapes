import React, { useCallback, useState } from 'react';

import { FilterSelect } from '../controls/FilterSelect';

import type { CategoryData } from '../../types/Sound';

type ControlPanelProps = {
  categories: Array<CategoryData>;
  themes: Array<CategoryData>;
  decades: Array<CategoryData>;
  types: Array<CategoryData>;
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
  hideClusteringToggle?: boolean;
  title?: string;
  description?: string;
  hideMinimizeButton?: boolean;
};

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
  searchResultCount,
  hideClusteringToggle,
  title = 'Filter the Map',
  description = 'Use the controls below to filter the sounds shown on the map.',
  hideMinimizeButton = false,
}: ControlPanelProps) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const parseNumber = useCallback((value: string) => Number(value) || null, []);

  const handleReset = useCallback(() => {
    onDecadeChange(null);
    onTypeChange(null);
    onCategoryChange(null);
    onThemeChange(null);
    onSearchChange('');
  }, [onDecadeChange, onTypeChange, onCategoryChange, onThemeChange, onSearchChange]);

  return (
    <div
      className={`control-panel marker-clustering-control-panel ${isMinimized ? 'minimized' : ''} ${hideMinimizeButton ? 'no-minimize' : ''}`}
    >
      <div className="control-panel-header">
        <h3>{title}</h3>
        {!hideMinimizeButton && (
          <button
            className="minimize-button"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Expand panel' : 'Minimize panel'}
          >
            {isMinimized ? '+' : '-'}
          </button>
        )}
      </div>
      {!isMinimized && (
        <>
          {description && <p>{description}</p>}
          <div className="search-control">
            <div className="search-input-wrapper">
              <input
                type="search"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
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
            <FilterSelect
              label="Filter by Decade"
              value={selectedDecade}
              options={decades}
              onChange={onDecadeChange}
              parseValue={parseNumber}
            />

            <FilterSelect
              label="Filter by Type"
              value={selectedType}
              options={types}
              onChange={onTypeChange}
            />

            <FilterSelect
              label="Filter by Class"
              value={selectedCategory}
              options={categories}
              onChange={onCategoryChange}
            />

            <FilterSelect
              label="Filter by Theme"
              value={selectedTheme}
              options={themes}
              onChange={onThemeChange}
            />
          </p>
          {!hideClusteringToggle && (
            <div className="clustering-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={clusteringEnabled}
                  onChange={e => onClusteringToggle(e.target.checked)}
                />
                Enable Marker Clustering
              </label>
            </div>
          )}
          <button id="filter-reset" onClick={handleReset}>
            Reset
          </button>
        </>
      )}
    </div>
  );
};
