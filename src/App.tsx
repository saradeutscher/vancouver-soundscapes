import React, {useState, useEffect, useCallback} from 'react';
import { createRoot } from 'react-dom/client';

import './App.css';

import { SoundMap } from './SoundMap';
import {Sound, loadSoundDataset} from './Sounds';
import { SoundCard } from './sound-card';

const App = () => {
  const [activePage, setActivePage] = useState("home");

  const [sounds, setSounds] = useState<Sound[]>();
  const [selectedSoundKey, setSelectedSoundKey] = useState<string | null>(null);

  // load data asynchronously
  useEffect(() => {
    loadSoundDataset().then(data => setSounds(data));
  }, []);

  const handleCardClick = useCallback(() => {
    setSelectedSoundKey(null);
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case "about":
        return (
          <div className="about">
            <h2>About</h2>
            <p>
              The project was inspired by the <a target="_blank" href="https://www.sfu.ca/~truax/wsp.html">World Soundscapes Project</a>,
              led by R. Murray Schaefer and Barry Truax at SFU.
            </p>
            <p>
              An interview with Barry Truax about the World Soundscapes Project was conducted by the CBC Radio show
              On the Coast with Gloria Macarenko. The interview can be found on the CBC website <a target="_blank" href="https://www.cbc.ca/player/play/audio/9.7035933">here</a>.
            </p>
          </div>
        );
      case "request":
        return (
          <div className="about">
            <h2>Request an Addition</h2>
            <p>
              form for adding a sound to the map here
            </p>
          </div>
          );
      case "sounds":
        return (
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
        )
      default:
        return (
          <div className="homepage">
            <SoundMap />
          </div>
        );
    }
  };

  return (
    <div className="site">
      <nav className="nav">
        <h1 className="title"> Vancouver Soundscapes </h1>
        <div className="nav-options">
          <button onClick={() => setActivePage("home")}>Home</button>
          <button onClick={() => setActivePage("about")}>About</button>
          <button onClick={() => setActivePage("request")}>Submit a Sound</button>
          <button onClick={() => setActivePage("sounds")}>Sounds</button>
        </div>
      </nav>

      <main className="content">{renderContent()}</main>

      {/* <footer id="footer">
        <img src="src/assets/wordmark.png"></img>
      </footer> */}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;