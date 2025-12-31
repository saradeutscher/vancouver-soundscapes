import React, {useState} from 'react';

type HomepageProps = {
  onFadeComplete: () => void;
}

export const Homepage: React.FC<HomepageProps> = ({onFadeComplete}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [activePage, setActivePage] = useState("home");

  const handleClick = () => {
    setIsClosing(true);

    setTimeout(onFadeComplete, 600);
  }

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
          <section>
            <h1 className="title"> Vancouver Soundscapes </h1>
          </section>
        );
    }
  };


  return (
    <div className={`overlay ${isClosing ? 'fade-out' : 'fade-in'}`}>
      <nav className="nav">
        <button onClick={() => setActivePage("home")}>Home</button>
        <button onClick={() => setActivePage("about")}>About</button>
      </nav>

      <main className="content">{renderContent()}</main>

      <button className="toggle-btn" onClick={handleClick}>
              Explore
      </button>
    </div>
  );
};