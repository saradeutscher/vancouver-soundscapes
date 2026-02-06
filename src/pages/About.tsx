import React, { useState, useMemo, useCallback } from 'react';

import { useScrollSpy } from '../hooks/useScrollSpy';

// Section structure configuration
const ABOUT_SECTIONS = [
  {
    id: 'about-project',
    title: 'About the Project',
    subsections: [
      { id: 'overview', title: 'Overview' },
      { id: 'history', title: 'History' },
      { id: 'goals', title: 'Goals' },
    ],
  },
  {
    id: 'team',
    title: 'Project Team',
    subsections: [
      { id: 'team-members', title: 'Team Members' },
      { id: 'contact', title: 'Contact' },
    ],
  },
  {
    id: 'technical',
    title: 'Technical',
    subsections: [
      { id: 'architecture', title: 'Architecture' },
      { id: 'data-sources', title: 'Data Sources' },
      { id: 'tech-stack', title: 'Technology Stack' },
    ],
  },
];

// Hero Banner Component
const HeroBanner: React.FC = () => {
  return (
    <div className="about-hero">
      <div className="about-hero-overlay">
        <h1 className="about-hero-title">About the Project</h1>
      </div>
    </div>
  );
};

// Sidebar Navigation Component
type SidebarProps = {
  sections: typeof ABOUT_SECTIONS;
  activeSection: string;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSection,
  isMobileOpen,
  onToggleMobile,
}) => {
  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // Account for header height
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      if (isMobileOpen) {
        onToggleMobile(); // Close mobile menu after click
      }
    }
  };

  return (
    <>
      <button
        className="about-mobile-toggle"
        onClick={onToggleMobile}
        aria-label="Toggle navigation menu"
      >
        {isMobileOpen ? '✕' : '☰'}
      </button>

      <aside className={`about-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <nav className="about-nav" aria-label="About page sections">
          {sections.map(section => (
            <div key={section.id} className="about-nav-section">
              <button
                className={`about-nav-item about-nav-parent ${
                  activeSection === section.id ? 'active' : ''
                }`}
                onClick={() => handleNavClick(section.id)}
              >
                {section.title}
              </button>
              {section.subsections.length > 0 && (
                <div className="about-nav-children">
                  {section.subsections.map(sub => (
                    <button
                      key={sub.id}
                      className={`about-nav-item about-nav-child ${
                        activeSection === sub.id ? 'active' : ''
                      }`}
                      onClick={() => handleNavClick(sub.id)}
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

// Main Content Component
const MainContent: React.FC = () => {
  return (
    <main className="about-main-content">
      {/* Section: About the Project */}
      <section id="about-project" className="about-section">
        <h2 className="about-section-header">About the Project</h2>

        <div id="overview" className="about-subsection">
          <h3>Overview</h3>
          <p>
            Vancouver Soundscapes is an interactive map application of sound recordings from
            different locations and time periods across Vancouver.
          </p>
          <p>
            The application provides an intuitive interface for exploring Vancouver&apos;s acoustic
            history, allowing users to explore sounds by location, time period, and thematic
            categories.
          </p>
        </div>

        <div id="history" className="about-subsection">
          <h3>History</h3>
          <p>
            The project was inspired by the{' '}
            <a href="https://www.sfu.ca/~truax/wsp.html" target="_blank" rel="noopener noreferrer">
              World Soundscapes Project
            </a>
            , led by R. Murray Schafer and Barry Truax at Simon Fraser University. Many of the
            sounds present on the map come from this original project.
          </p>
          <p>
            An interview with Barry Truax about the World Soundscapes Project was conducted by CBC
            Radio&apos;s &quot;On the Coast&quot; with Gloria Macarenko.{' '}
            <a
              href="https://www.cbc.ca/player/play/audio/9.7035933"
              target="_blank"
              rel="noopener noreferrer"
            >
              Listen to the interview on CBC
            </a>
            .
          </p>
        </div>

        <div id="goals" className="about-subsection">
          <h3>Goals</h3>
          <p>Add info about the goals of the project here</p>
          <ul>
            <li>info</li>
            <li>more info</li>
            <li>even more info</li>
          </ul>
        </div>
      </section>

      {/* Section: Project Team */}
      <section id="team" className="about-section">
        <h2 className="about-section-header">Project Team</h2>

        <div id="team-members" className="about-subsection">
          <h3>Team Members</h3>
          <p> add info here </p>
          {/* <p>
            <strong>Sara Deutscher</strong> - Website developer
            <br />
            Responsible for application development, user interface design, and data visualization.
          </p> */}
        </div>

        <div id="contact" className="about-subsection">
          <h3>Contact</h3>
          <p>Problems with the website? Let us know.</p>
          <p>
            <strong>Email:</strong> <a href="mailto:saradeu@outlook.com">saradeu@outlook.com</a>
          </p>
          <p>Interested in contributing to the project?</p>
          <p>
            <strong>Submit a Sound:</strong> Visit our <a href="/request">sound submission page</a>{' '}
            to contribute recordings to the project.
          </p>
        </div>
      </section>

      {/* Section: Technical */}
      <section id="technical" className="about-section">
        <h2 className="about-section-header">Technical</h2>

        <div id="architecture" className="about-subsection">
          <h3>Architecture</h3>
          <p>
            Vancouver Soundscapes is a client-side React application built with TypeScript that
            provides an interactive map-based interface for exploring sounds recordings around
            Vancouver. The application follows a component-based architecture.
          </p>
          <p>
            Key architectural features include client-side search with Lunr.js for fast full-text
            search without requiring a backend, marker clustering for optimized map performance, and
            URL-based state management for shareable links to specific sounds.
          </p>
          <p>
            For detailed technical documentation, including data flow, component structure, and
            development guidelines, visit the{' '}
            <a
              href="https://github.com/saradeutscher/vancouver-soundscapes/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub page for the project
            </a>
            .
          </p>
        </div>

        <div id="data-sources" className="about-subsection">
          <h3>Data Sources</h3>
          <p>
            Sound recordings are stored in a GeoJSON-format dataset that includes geographic
            coordinates, temporal metadata, and audio file references for each recording. Some
            recordings also have theme/class coding and images. Audio files and images are hosted in
            cloud storage through the Digital Research Alliance of Canada.
          </p>
          <p>
            The dataset will be updated periodically with new sound recordings as they are collected
            and reviewed.
          </p>
        </div>

        <div id="tech-stack" className="about-subsection">
          <h3>Technology Stack</h3>
          <p>
            <strong>Core Technologies:</strong>
          </p>
          <ul>
            <li>
              <strong>React 19</strong> - UI library for building interactive components
            </li>
            <li>
              <strong>TypeScript</strong> - Type-safe JavaScript
            </li>
            <li>
              <strong>Vite</strong> - Web development tool
            </li>
            <li>
              <strong>React Router</strong> - Client-side routing for navigation
            </li>
          </ul>
          <p>
            <strong>Mapping & Visualization:</strong>
          </p>
          <ul>
            <li>
              <strong>Google Maps API</strong> - Interactive mapping platform
            </li>
            <li>
              <strong>@vis.gl/react-google-maps</strong> - React wrapper for Google Maps
            </li>
            <li>
              <strong>@googlemaps/markerclusterer</strong> - Marker clustering
            </li>
          </ul>
          <p>
            <strong>Search:</strong>
          </p>
          <ul>
            <li>
              <strong>Lunr.js</strong> - Client-side full-text search indexing
            </li>
          </ul>
          <p>
            <strong>Development Tools:</strong>
          </p>
          <ul>
            <li>
              <strong>ESLint</strong> - Code quality and style enforcement
            </li>
            <li>
              <strong>Prettier</strong> - Code formatting
            </li>
            <li>
              <strong>Stylelint</strong> - CSS linting
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

// Main About Component
export const About: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get all section IDs for scroll spy
  const sectionIds = useMemo(() => {
    const ids: string[] = [];
    ABOUT_SECTIONS.forEach(section => {
      ids.push(section.id);
      section.subsections.forEach(sub => ids.push(sub.id));
    });
    return ids;
  }, []);

  const activeSection = useScrollSpy(sectionIds, 100);

  const handleToggleMobile = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <div className="about-page-new">
      <HeroBanner />
      <div className="about-container">
        <Sidebar
          sections={ABOUT_SECTIONS}
          activeSection={activeSection}
          isMobileOpen={isMobileMenuOpen}
          onToggleMobile={handleToggleMobile}
        />
        <MainContent />
      </div>
    </div>
  );
};
