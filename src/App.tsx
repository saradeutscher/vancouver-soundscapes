import React, {useState, useEffect, useCallback} from 'react';
import { createRoot } from 'react-dom/client';

import './App.css';

import { SoundMap } from './SoundMap';
import {Sound, loadSoundDataset} from './Sounds';
import { SoundCard } from './sound-card';

const App = () => {
  const [showOverlay, setShowOverlay] = useState(true);
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
              add info here
            </p>
          </div>
        );
      case "sounds":
        return (
          <div className="sounds">
            <h2>All Sounds</h2>
            <p>
              add card gallery of sounds here
            </p>
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
          <button onClick={() => setActivePage("sounds")}>Sounds</button>
        </div>
      </nav>

      <main className="content">{renderContent()}</main>

    </div>
  );
};
const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;