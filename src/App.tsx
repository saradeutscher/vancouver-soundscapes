import React, {useState, useEffect, useCallback} from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import './App.css';

import { SoundMap } from './SoundMap';
import {Sound, loadSoundDataset} from './Sounds';
import { SoundCard } from './sound-card';

const App = () => {
  const [sounds, setSounds] = useState<Sound[]>();
  const [selectedSoundKey, setSelectedSoundKey] = useState<string | null>(null);

  // load data asynchronously
  useEffect(() => {
    loadSoundDataset().then(data => setSounds(data));
  }, []);

  const handleCardClick = useCallback(() => {
    setSelectedSoundKey(null);
  }, []);

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
                <SoundMap />
              </div>
            } />
            <Route path="/about" element={
              <div className="about">
                <h2>About</h2>
                <p>
                  The project was inspired by the <a target="_blank" href="https://www.sfu.ca/~truax/wsp.html">World Soundscapes Project</a>,
                  led by R. Murray Schaefer and Barry Truax at SFU.
                </p>
                <p>
                  An interview with Barry Truax about the World Soundscapes Project was conducted by the CBC Radio show
                  On the Coast with Gloria Macarenko. The interview can be found <a target="_blank" href="https://www.cbc.ca/player/play/audio/9.7035933">on the CBC website</a>.
                </p>
              </div>
            } />
            <Route path="/request" element={
              <div className="about">
                <h2>Request an Addition</h2>
                <p>
                  Form to request an addition to the map coming soon.
                </p>
              </div>
            } />
            <Route path="/sounds" element={
              <div className="sounds">
                <h2 id="sounds-page-title">All Sounds</h2>
                <input type="search" id="sound-search" name="q"  placeholder="Search the sounds..."/>
                <button>Search</button>
                <div className="sound-cards">
                {sounds?.map(sound => (
                  <SoundCard
                    key={sound.key}
                    sound={sound}
                    onClick={() => handleCardClick}
                  />
                 ))}
                </div>
              </div>
            } />
          </Routes>
        </main>

        {/* <footer id="footer">
          <img src="src/assets/wordmark.png"></img>
        </footer> */}
      </div>
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;