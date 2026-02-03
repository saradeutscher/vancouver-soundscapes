import {useState, useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import './styles/global.css';

import { SoundMap } from './components/map/SoundMap';
import { loadSoundDataset } from './services/soundService';
import type { Sound } from './types/Sound';
import { About } from './pages/About';
import { SubmitSound } from './pages/SubmitSound';
import { SoundsPage } from './pages/SoundsPage';
import { SoundDetailPage } from './pages/SoundDetailPage';
import lunr from 'lunr';

const App = () => {
  const [sounds, setSounds] = useState<Sound[]>();
  const [searchIndex, setSearchIndex] = useState<lunr.Index | null>(null);

  // load data asynchronously
  useEffect(() => {
    loadSoundDataset().then(data => setSounds(data));
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
          description: sound.properties.description
        });
      });
    });

    setSearchIndex(idx);
  }, [sounds]);

  return (
    <BrowserRouter>
      <div className="site">
        <nav className="nav">
          <h1 className="title"> Vancouver Soundscapes </h1>
          <div className="nav-options">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/request">Submit a Sound</Link>
            <Link to="/sounds">Sound List</Link>
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={
              <div className="homepage">
                <SoundMap searchIndex={searchIndex} />
              </div>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/request" element={<SubmitSound />} />
            <Route path="/sounds" element={
              <SoundsPage sounds={sounds} searchIndex={searchIndex} />
            } />
            <Route path="/sounds/:id" element={
              <SoundDetailPage sounds={sounds} />
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;