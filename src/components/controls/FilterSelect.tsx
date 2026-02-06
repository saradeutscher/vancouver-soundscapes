import React, { useCallback } from 'react';

import type { CategoryData } from '../../types/Sound';

type FilterSelectProps = {
  label: string;
  value: string | number | null;
  options: CategoryData[];
  onChange: (value: string | number | null) => void;
  parseValue?: (value: string) => string | number | null;
};

/**
 * Reusable select dropdown component for filtering
 * Displays options with counts and handles value parsing
 */
export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  options,
  onChange,
  parseValue,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const rawValue = e.target.value;
      const parsedValue = parseValue ? parseValue(rawValue) : rawValue || null;
      onChange(parsedValue);
    },
    [onChange, parseValue]
  );

  return (
    <>
      <label> {label}:</label>{' '}
      <select value={value ?? ''} onChange={handleChange}>
        <option value={''}>All sounds</option>
        {options.map(option => (
          <option key={option.key} value={option.key}>
            {option.label} ({option.count})
          </option>
        ))}
      </select>
    </>
  );
};
