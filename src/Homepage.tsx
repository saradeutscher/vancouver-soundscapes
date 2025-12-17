import React, {useState} from 'react';

type HomepageProps = {
  onFadeComplete: () => void;
}

export const Homepage: React.FC<HomepageProps> = ({onFadeComplete}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClick = () => {
    setIsClosing(true);

    setTimeout(onFadeComplete, 600);
  }

  return (
    <div className={`overlay ${isClosing ? 'fade-out' : 'fade-in'}`}>
      <h1 className="title"> Vancouver Soundscapes </h1>
      <button className="toggle-btn" onClick={handleClick}>
        Explore
      </button>
    </div>
  );
};