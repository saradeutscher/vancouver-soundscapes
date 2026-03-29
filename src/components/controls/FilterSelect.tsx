import React, { useCallback } from 'react';

import type { CategoryData } from '../../types/Sound';

type FilterSelectProps<T extends string | number> = {
  label: string;
  value: T | null;
  options: CategoryData[];
  onChange: (value: T | null) => void;
  parseValue?: (value: string) => T | null;
};

/**
 * Reusable select dropdown component for filtering
 * Displays options with counts and handles value parsing
 */
export const FilterSelect = <T extends string | number>({
  label,
  value,
  options,
  onChange,
  parseValue,
}: FilterSelectProps<T>) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const rawValue = e.target.value;
      const parsedValue = parseValue ? parseValue(rawValue) : ((rawValue || null) as T | null);
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
