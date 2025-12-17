import React, {useState} from 'react';
import { createRoot } from 'react-dom/client';

import './App.css';

import { SoundMap } from './SoundMap';
import {Homepage} from './Homepage'

const App = () => {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <div className="homepage">
      <SoundMap />

      {showOverlay && <Homepage onFadeComplete={() => setShowOverlay(false)}/>}

    </div>
  );
};
const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;