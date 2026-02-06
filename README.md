# Vancouver Soundscapes

Vancouver Soundscapes is a client-side React application built with TypeScript that provides an interactive map-based interface for exploring sounds recordings around Vancouver.

The project was inspired by the [World Soundscapes Project](https://www.sfu.ca/~truax/wsp.html), led by R. Murray Schaefer and Barry Truax at SFU.
Many of the sound recordings come from that original project.

## Table of Contents

<!-- - [About](#about) -->
- [Site Design](#site-design)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
  - [Available Scripts](#available-scripts)
  - [Code Quality](#code-quality)
- [Architecture](#architecture)
- [Data Sources](#data-sources)
- [Accessibility](#accessibility)
- [Known Issues](#known-issues)
- [License](#license)
- [Acknowledgments](#acknowledgments)
<!-- - [Contact](#contact) -->

<!-- ## About

[Detailed description of the project, its purpose, and goals] -->

## Site Design

[Add screenshots here]

## Tech Stack

**Frontend:**
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [React Router](https://reactrouter.com/) - Client-side routing
- [Google Maps API](https://developers.google.com/maps) - Interactive maps
- [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/) - React wrapper for Google Maps

**Search:**
- [Lunr.js](https://lunrjs.com/) - Client-side full-text search

**Code Quality:**
- [ESLint](https://eslint.org/) - Linting (8 plugins configured)
- [TypeScript ESLint](https://typescript-eslint.io/) - TypeScript linting
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) - Accessibility linting


## Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher (20.x LTS recommended)
- **npm** 9.0.0 or higher

Check your versions:
```bash
node --version
npm --version
```

> **Note:** This project uses Vite 7 and React 19, which require Node.js 18+. Node.js 20 LTS or higher is recommended for optimal performance and security.

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd vancouver-soundscapes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

```

### Running the Application

**Development mode:**
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

**Production build:**
```bash
npm run build
npm run preview
```

<!-- ## Usage

### Basic Navigation

[Explain how users can navigate the application]

### Searching for Sounds

[Explain search functionality]

### Filtering

[Explain filtering options]

### Submitting a Sound

[explain submission process] -->

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── map/                # Map-related components
│   │   ├── SoundMap.tsx           # Main map container with filters
│   │   ├── SoundMarker.tsx        # Individual sound markers (Point & LineString)
│   │   ├── ClusteredSoundMarkers.tsx  # Marker clustering logic
│   │   ├── Polyline.tsx           # Animated polyline for soundwalks
│   │   ├── ControlPanel.tsx       # Filter controls sidebar
│   │   ├── MapController.tsx      # URL-based sound selection handler
│   │   └── MapLocationPicker.tsx  # Interactive map for location selection
│   │
│   └── sound/              # Sound-related components
│       ├── SoundCard.tsx          # Sound card for grid display (accessible Link)
│       ├── MetadataBadges.tsx     # Reusable decade/class/theme/type badges
│       ├── AudioPlayer.tsx        # Audio playback component
│       ├── ImageGallery.tsx       # Image gallery with lightbox
│       └── StaticMapImage.tsx     # Static map thumbnail generator
│
├── pages/                  # Page-level components (routes)
│   ├── About.tsx                  # /about - About page
│   ├── SubmitSound.tsx            # /request - Sound submission form
│   ├── SoundsPage.tsx             # /sounds - Sound gallery with filters
│   └── SoundDetailPage.tsx        # /sounds/:id - Individual sound detail pages
│
├── hooks/                  # Custom React hooks
│   ├── useDebounce.ts             # Debounce hook for search input (300ms)
│   ├── useScrollSpy.ts            # Scroll spy to track active section using IntersectionObserver
│   └── useFilteredSounds.ts       # Combined filtering logic hook
│
├── services/               # Data loading logic
│   └── soundService.ts            # Sound data loading and aggregation utilities
│
├── constants/              # Shared constants
│   ├── assets.ts                  # CDN base URL and getAssetUrl() helper
│   └── colors.ts                  # Decade color mapping
│
├── types/                  # TypeScript type definitions
│   ├── Sound.ts                   # Sound and CategoryData types
│   └── lunr.d.ts                  # Lunr.js type
│
├── utils/                  # Utility functions
│   └── coordinates.ts             # Coordinate parsing utilities
│
├── data/                   # Static data files
│   └── sounds.json                # Sound dataset (GeoJSON-like)
│
├── styles/                 # CSS stylesheets
│   ├── tokens.css                 # CSS design tokens (colors, spacing, etc.)
│   ├── global.css                 # Main app styles (imports tokens.css)
│   └── index.css                  # Root styles
│
├── App.tsx                 # Root application component with routing
└── main.tsx                # Application entry point
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Run Stylelint (CSS linter)
npm run lint:css

# Auto-fix Stylelint issues
npm run lint:css:fix

# Format code with Prettier
npm run format

# Check code formatting (useful for CI/CD)
npm run format:check
```

### Code Quality

**TypeScript**: Strict mode enabled

**ESLint Plugins:**
1. TypeScript ESLint
2. React
3. React Hooks
4. JSX Accessibility
5. Import
6. Promise
7. SonarJS
8. React Refresh

### Architecture

 The application uses a component-based architecture with custom hooks for shared logic and CSS design tokens for consistent styling.

**Data Flow:**

1. Sound data is loaded from static JSON files on application mount
2. Lunr.js search index is built from sound properties (name, notes, description)
3. User interactions (search, filters) update component state
4. Custom hooks (useFilteredSounds) combine multiple filter criteria
5. Filtered results render as map markers or gallery cards
6. URL parameters sync with selected sounds for shareable links

## Data Sources

**Sound Data:**
- Format: GeoJSON
- Source: sounds.json
- Update frequency: Will be updated periodically with new sounds

**Audio Files:**
- Hosted on: Digital Research Alliance of Canada
- Format: .wav/.mp3

**Images:**
- Hosted on: Digital Research Alliance of Canada
- Format: .jpg

## Accessibility

<!-- - **WCAG Level A Compliant** -->
- **Keyboard Navigation** - Interactive elements accessible via keyboard
- **Screen Reader Support** - Semantic HTML and ARIA labels
- **Responsive Design** - Works on all screen sizes

## Known Issues

- tbd

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

<!-- **[Institution/Organization Name]** - [Role/contribution]

**Data Sources** - [Credit for data providers] -->

This project is built using many open-source libraries and tools:

**Core Libraries:**
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Fast build tool and dev server
- [React Router](https://reactrouter.com/) - Client-side routing
- [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/) - React wrapper for Google Maps
- [@googlemaps/markerclusterer](https://github.com/googlemaps/js-markerclusterer) - Map marker clustering
- [Lunr.js](https://lunrjs.com/) - Client-side full-text search

**Development Tools:**
- [ESLint](https://eslint.org/) - JavaScript linting
- [Prettier](https://prettier.io/) - Code formatting
- [Stylelint](https://stylelint.io/) - CSS linting

<!-- ## Contact

**Project Maintainer:** Sara Deutscher
- Email: saradeu@outlook.com
- GitHub: [@saradeutscher](https://github.com/saradeutscher)

**Project Link:** [https://github.com/saradeutscher/vancouver-soundscapes](https://github.com/saradeutscher/vancouver-soundscapes)

 -->
