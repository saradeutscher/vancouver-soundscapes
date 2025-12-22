import React, {useCallback} from 'react';

import { CategoryData } from './Sounds';

type ControlPanelProps = {
  categories: Array<CategoryData>;
  themes: Array<CategoryData>;
  decades: Array<CategoryData>;
  onCategoryChange: (value: string | null) => void;
  onThemeChange: (value: string | null) => void;
  onDecadeChange: (value: number | null) => void;
}

export const ControlPanel = ({
  categories,
  themes,
  decades,
  onCategoryChange,
  onThemeChange,
  onDecadeChange
}: ControlPanelProps) => {
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

  return (
    <div className="control-panel marker-clustering-control-panel">
      <h3>Filter the Map</h3>
        <p>
          Use the controls below to filter the sounds shown on the map.
        </p>
        <p>
          <label> Filter by Category:</label>{' '}
          <select onChange={handleCategoryChange}>
            <option value={''}>All sounds</option>

            {categories.map(category => (
              <option key={category.key} value={category.key}>
                {category.label} ({category.count})
              </option>
            ))}
          </select>

          <label> Filter by Theme:</label>{' '}
          <select onChange={handleThemeChange}>
            <option value={''}>All sounds</option>

            {themes.map(theme => (
              <option key={theme.key} value={theme.key}>
                {theme.label} ({theme.count})
              </option>
            ))}
          </select>

          <label> Filter by Year:</label>{' '}
          <select onChange={handleDecadeChange}>
            <option value={''}>All sounds</option>

            {decades.map(decade => (
              <option key={decade.key} value={decade.key}>
                {decade.label} ({decade.count})
              </option>
            ))}
          </select>
        </p>
    </div>
  );
};