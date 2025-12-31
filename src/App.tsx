import React, {useState} from 'react';
import { createRoot } from 'react-dom/client';

import './App.css';

import { SoundMap } from './SoundMap';
import {Homepage} from './Homepage'

const App = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [activePage, setActivePage] = useState("home");

  const renderContent = () => {
    switch (activePage) {
      case "about":
        return (
          <section>
            <h2>About</h2>
            <p>
              add info here
            </p>
          </section>
        );

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
        </div>
      </nav>

      <main className="content">{renderContent()}</main>

    </div>
  );
};
const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;