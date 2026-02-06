import lunr from 'lunr';
import { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

import './styles/global.css';

import { SoundMap } from './components/map/SoundMap';
import { About } from './pages/About';
import { SoundDetailPage } from './pages/SoundDetailPage';
import { SoundsPage } from './pages/SoundsPage';
import { SubmitSound } from './pages/SubmitSound';
import { loadSoundDataset } from './services/soundService';

import type { Sound } from './types/Sound';

const App = () => {
  const [sounds, setSounds] = useState<Sound[]>();
  const [searchIndex, setSearchIndex] = useState<lunr.Index | null>(null);

  // load data asynchronously
  useEffect(() => {
    loadSoundDataset()
      .then(data => setSounds(data))
      .catch(error => console.log(error));
  }, []);

  // create search index when sounds are loaded
  useEffect(() => {
    if (!sounds) return;

    const idx = lunr(function () {
      this.ref('key');
      this.field('name', { boost: 10 });
      this.field('notes', { boost: 5 });
      this.field('description', { boost: 2 });

      sounds.forEach(sound => {
        this.add({
          key: sound.key,
          name: sound.properties.name,
          notes: sound.properties.notes,
          description: sound.properties.description,
        });
      });
    });

    setSearchIndex(idx);
  }, [sounds]);

  return (
    <BrowserRouter>
      <div className="site">
        <nav className="nav" aria-label="Main navigation">
          <h1 className="title"> Vancouver Soundscapes </h1>
          <div className="nav-options">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/request">Submit a Sound</NavLink>
            <NavLink to="/sounds">Sound List</NavLink>
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route
              path="/"
              element={
                <div className="homepage">
                  <SoundMap searchIndex={searchIndex} />
                </div>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/request" element={<SubmitSound />} />
            <Route
              path="/sounds"
              element={<SoundsPage sounds={sounds} searchIndex={searchIndex} />}
            />
            <Route path="/sounds/:id" element={<SoundDetailPage sounds={sounds} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
); // Only use StrictMode for development

export default App;
