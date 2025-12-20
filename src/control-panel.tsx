import React, {useCallback} from 'react';

import { CategoryData } from './Sounds';

type ControlPanelProps = {
  categories: Array<CategoryData>;
  onCategoryChange: (value: string | null) => void;
}

export const ControlPanel = ({
  categories,
  onCategoryChange
}: ControlPanelProps) => {
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onCategoryChange(e.target.value || null);
    },
    [onCategoryChange]
  );

  return (
    <div className="control-panel marker-clustering-control-panel">
      <h3>Filter the Map by Category</h3>
        <p>
          Use the select element to filter the sounds shown on the map by
          sound category.
        </p>
        <p>
          <label> Filter Sounds:</label>{' '}
          <select onChange={handleCategoryChange}>
            <option value={''}>All sounds</option>

            {categories.map(category => (
              <option key={category.key} value={category.key}>
                {category.label} ({category.count})
              </option>
            ))}
          </select>
        </p>
    </div>
  );
};