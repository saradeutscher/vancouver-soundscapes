import { useCallback, useState } from 'react';

import { FilterSelect } from '../controls/FilterSelect';

import type { CategoryData } from '../../types/Sound';

type ControlPanelProps = {
  categories: Array<CategoryData>;
  themes: Array<CategoryData>;
  decades: Array<CategoryData>;
  years: Array<CategoryData>;
  types: Array<CategoryData>;
  sources: Array<CategoryData>;
  selectedCategory: string | null;
  selectedTheme: string | null;
  selectedDecade: number | null;
  selectedYear: number | null;
  selectedType: string | null;
  selectedSource: string | null;
  clusteringEnabled: boolean;
  onCategoryChange: (value: string | null) => void;
  onThemeChange: (value: string | null) => void;
  onDecadeChange: (value: number | null) => void;
  onYearChange: (value: number | null) => void;
  onTypeChange: (value: string | null) => void;
  onSourceChange: (value: string | null) => void;
  onClusteringToggle: (enabled: boolean) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchResultCount?: number;
  hideClusteringToggle?: boolean;
  title?: string;
  description?: string;
  hideMinimizeButton?: boolean;
  /** Mobile sheet mode: whether the sheet is currently open */
  isSheetOpen?: boolean;
  /** Mobile sheet mode: callback to close the sheet */
  onClose?: () => void;
};

export const ControlPanel = ({
  categories,
  themes,
  decades,
  years,
  types,
  sources,
  selectedCategory,
  selectedTheme,
  selectedDecade,
  selectedYear,
  selectedType,
  selectedSource,
  clusteringEnabled,
  onCategoryChange,
  onThemeChange,
  onDecadeChange,
  onYearChange,
  onTypeChange,
  onSourceChange,
  onClusteringToggle,
  searchQuery,
  onSearchChange,
  searchResultCount,
  hideClusteringToggle,
  title = 'Filter the Map',
  description = 'Use the controls below to filter the sounds shown on the map.',
  hideMinimizeButton = false,
  isSheetOpen,
  onClose,
}: ControlPanelProps) => {
  const [isMinimized, setIsMinimized] = useState(false);

  // When onClose is provided the panel is rendered as a mobile bottom sheet.
  // Sheet visibility is controlled externally via isSheetOpen / onClose.
  const isMobileSheet = !!onClose;

  const parseNumber = useCallback((value: string) => Number(value) || null, []);

  const handleReset = useCallback(() => {
    onDecadeChange(null);
    onYearChange(null);
    onTypeChange(null);
    onCategoryChange(null);
    onThemeChange(null);
    onSourceChange(null);
    onSearchChange('');
  }, [
    onDecadeChange,
    onYearChange,
    onTypeChange,
    onCategoryChange,
    onThemeChange,
    onSourceChange,
    onSearchChange,
  ]);

  // In sheet mode content is always shown; in desktop mode respect isMinimized
  const showContent = isMobileSheet || !isMinimized;

  return (
    <div
      className={[
        'control-panel',
        'marker-clustering-control-panel',
        !isMobileSheet && isMinimized ? 'minimized' : '',
        hideMinimizeButton ? 'no-minimize' : '',
        isMobileSheet ? 'mobile-sheet' : '',
        isMobileSheet && isSheetOpen ? 'sheet-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isMobileSheet && <div className="sheet-drag-handle" aria-hidden="true" />}
      <div className="control-panel-header">
        <h3>{title}</h3>
        {isMobileSheet ? (
          <button className="sheet-close-button" onClick={onClose} aria-label="Close filter panel">
            ✕
          </button>
        ) : (
          !hideMinimizeButton && (
            <button
              className="minimize-button"
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? 'Expand panel' : 'Minimize panel'}
            >
              {isMinimized ? '+' : '-'}
            </button>
          )
        )}
      </div>
      {showContent && (
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
            <FilterSelect<number>
              label="Filter by Decade"
              value={selectedDecade}
              options={decades}
              onChange={onDecadeChange}
              parseValue={parseNumber}
            />

            <FilterSelect<number>
              label="Filter by Year"
              value={selectedYear}
              options={years}
              onChange={onYearChange}
              parseValue={parseNumber}
            />

            <FilterSelect<string>
              label="Filter by Type"
              value={selectedType}
              options={types}
              onChange={onTypeChange}
            />

            <FilterSelect<string>
              label="Filter by Class"
              value={selectedCategory}
              options={categories}
              onChange={onCategoryChange}
            />

            <FilterSelect<string>
              label="Filter by Theme"
              value={selectedTheme}
              options={themes}
              onChange={onThemeChange}
            />

            <FilterSelect<string>
              label="Filter by Source"
              value={selectedSource}
              options={sources}
              onChange={onSourceChange}
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
