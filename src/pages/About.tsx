import React, { useState, useMemo, useCallback } from 'react';

import { UnderConstructionBanner } from '../components/sound/UnderConstructionBanner';
import { useScrollSpy } from '../hooks/useScrollSpy';

// Section structure configuration
const ABOUT_SECTIONS = [
  {
    id: 'about-project',
    title: 'About the Project',
    subsections: [
      { id: 'overview', title: 'Overview' },
      { id: 'questions', title: 'Research Questions' },
      { id: 'approach', title: 'Approach' },
      { id: 'outputs', title: 'Project outputs' },
      { id: 'teaching', title: 'Teaching' },
    ],
  },
  {
    id: 'team',
    title: 'Project Team',
    subsections: [
      { id: 'team-members', title: 'Team Members' },
      { id: 'funding', title: 'Partners and Funding' },
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
            The Vancouver Soundscapes Project is a research and teaching initiative based in the
            Department of Geography at the University of British Columbia. It uses sound recordings
            to study how Vancouver has changed over the past fifty years.
          </p>
          <p>
            The project builds on the work of the World Soundscape Project, which recorded
            Vancouver's acoustic environment at Simon Fraser University in the 1970s. We are making
            new recordings at the same location and comparing them with the historical archive.
            Alongside this, we look at records of rezoning, land values, housing and ecological
            changes at those sites. The aim is to understand how processes such as development,
            gentrification and environmental change show up in the city's soundscape, and how
            residents experience these changes.
          </p>
        </div>

        <div id="questions" className="about-subsection">
          <h3>Research Questions</h3>
          <ul>
            <li>What sounds characterize a rapidly changing city?</li>
            <li>
              What can changes in a city's soundscape tell us about its economic, social and
              ecological conditions?
            </li>
            <li>How has Vancouver's soundscape changed since the 1970s?</li>
            <li>
              What do students and members of the public learn about a place by listening to it?
            </li>
          </ul>
          {/*
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
          */}
        </div>

        <div id="approach" className="about-subsection">
          <h3>Approach</h3>
          <p>
            The project treats listening as a research method in geography. Our work draws on
            critical Indigenous sound studies, and we aim to follow culturally appropriate protocols
            when recording and sharing sound. We also design project outputs to be accessible,
            including for people who engage non-visually.
          </p>
        </div>

        <div id="outputs" className="about-subsection">
          <h3>Project Outputs</h3>
          <ul>
            <li>
              <strong>Interactive sound map</strong> of historical and contemporary recordings and
              archival soundwalks.
            </li>
            <li>
              <strong>Geo-located soundwalks</strong> using the Echoes app, which play recordings at
              specific sites across Vancouver.
            </li>
            <li>
              <strong>Museum of Vancouver listening space</strong>, a sound installation developed
              with the museum.
            </li>
            <li>
              <strong>Public listening sessions</strong> hosted with community partners.
            </li>
            <li>
              <strong>Teaching resources</strong> and scholarly publications.
            </li>
          </ul>
        </div>

        <div id="teaching" className="about-subsection">
          <h3>Teaching</h3>
          <p>
            Materials from the project are used in UBC Geography and Urban Studies courses. Students
            use the sound map, complete soundwalks, make their own recordings and write reflections
            connecting what they hear to course concepts on urban change. A related project, Voices
            of the Unseen, shares audio recordings of UBC custodial staff describing their work and
            experiences on campus.
          </p>
        </div>
      </section>

      {/* Section: Project Team */}
      <section id="team" className="about-section">
        <h2 className="about-section-header">Project Team</h2>

        <div id="team-members" className="about-subsection">
          <h3>Team members</h3>
          <p>
            <strong>Dr. Siobhán Wittig McPhee - </strong>
            Associate Professor of Teaching, Geography, UBC (co-lead)
          </p>
          <p>
            <strong>Dr. Michele Koppes - </strong>
            Professor, Geography, UBC (co-lead)
          </p>
          <p>
            <strong>Dr. Dylan Robinson - </strong>
            Professor, Music, UBC
          </p>
          <p>
            <strong>Dr. Milena Droumeva - </strong>
            Associate Professor, Communication, SFU
          </p>
          <p>
            <strong>Dr. Viviane Gosselin - </strong>
            Director of Collections & Exhibitions, Museum of Vancouver
          </p>
          <p>
            <strong>Carmen Papalia - </strong>
            Artist and Accessibility Advisor, Museum of Vancouver
          </p>
          <p>
            <strong>Graduate and undergraduate research assistants: </strong>
            <br />
            Sara Deutscher, Kendyll Carr, Azélie Blanchette, Amanda Bradshaw
          </p>
        </div>

        <div id="funding" className="about-subsection">
          <h3>Partners and Funding</h3>
          <ul>
            <li>Museum of Vancouver</li>
            <li>SFU Sonic Research Studio</li>
            <li>UBC Public Humanities Hub</li>
            <li>UBC Department of Geography</li>
          </ul>
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
      <UnderConstructionBanner />
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
