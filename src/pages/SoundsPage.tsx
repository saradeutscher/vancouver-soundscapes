import React, { useState, useEffect, useMemo } from 'react';
import type { Sound } from '../types/Sound';
import { SoundCard } from '../components/sound/SoundCard';
import lunr from 'lunr';

type SoundsPageProps = {
  sounds?: Sound[];
  searchIndex: lunr.Index | null;
};

export const SoundsPage: React.FC<SoundsPageProps> = ({ sounds, searchIndex }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Set<string> | null>(null);

  // Debounced search effect
  useEffect(() => {
    if (!searchIndex || !searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        const results = searchIndex.search(searchQuery);
        const resultKeys = new Set<string>(results.map((r: any) => r.ref as string));
        setSearchResults(resultKeys);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults(new Set<string>());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchIndex]);

  // Filter sounds based on search
  const filteredSounds = useMemo(() => {
    if (!sounds) return [];
    if (!searchResults) return sounds;
    return sounds.filter(s => searchResults.has(s.key));
  }, [sounds, searchResults]);

  return (
    <div className="sounds-page">
      <div className="sounds-page-header">
        <h2 id="sounds-page-title">All Sounds</h2>

        <div className="sounds-search-container">
          <input
            type="search"
            className="sounds-search-input"
            placeholder="Search the sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults && (
            <p className="search-result-count">
              Found {filteredSounds.length} sound{filteredSounds.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="sounds-grid">
        {filteredSounds.map(sound => (
          <SoundCard key={sound.key} sound={sound} />
        ))}
      </div>

      {filteredSounds.length === 0 && searchQuery && (
        <div className="no-results">
          <p>No sounds found for "{searchQuery}"</p>
          <button onClick={() => setSearchQuery('')}>Clear search</button>
        </div>
      )}
    </div>
  );
};
