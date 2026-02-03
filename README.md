# Vancouver Soundscapes

Uses Google Maps Javascript API and Vite's react-google-maps to display a map of Vancouver with sound files recorded at different locations in the city.


Built using React + Vite starting template

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh


## Directory Structure

```
src/
├── components/              # Reusable UI components
│   ├── map/                # Map-related components
│   │   ├── SoundMap.tsx           # Main map container
│   │   ├── SoundMarker.tsx        # Individual sound markers
│   │   ├── ClusteredSoundMarkers.tsx  # Marker clustering logic
│   │   ├── Polyline.tsx           # Animated polyline for soundwalks
│   │   ├── ControlPanel.tsx       # Filter controls sidebar
│   │   └── MapLocationPicker.tsx  # Interactive map for location selection
│   │
│   ├── sound/              # Sound-related components
│   │   ├── SoundCard.tsx          # Sound card for grid display
│   │   ├── ImageGallery.tsx       # Image gallery
│   │   └── StaticMapImage.tsx     # Static map thumbnail generator
│   │
│   └── articles/           # Article-related components
│       └── ArticleCard.tsx        # Expandable article card
│
├── pages/                  # Page-level components (routes)
│   ├── About.tsx                  # /about - About page with articles
│   ├── SubmitSound.tsx            # /request - Sound submission form
│   ├── SoundsPage.tsx             # /sounds - Sound grid with search
│   └── SoundDetailPage.tsx        # /sounds/:id - Individual sound detail page
│
├── services/               # Data loading
│   └── soundService.ts            # Sound data loading and category utilities
│
├── types/                  # TypeScript type definitions
│   ├── Article.ts                 # Article type
│   └── Sound.ts                   # Sound and CategoryData types
│
├── utils/                  # Utility functions
│   └── articles.ts                # Article loading and formatting utilities
│
├── data/                   # Static data files
│   ├── sounds.json               # Sound dataset
│   └── articles.json             # articles data
│
├── styles/                 # CSS stylesheets
│   ├── global.css                # Main app styles
│   ├── About.css                 # About page styles
│   ├── SubmitSound.css           # Submit form styles
│   └── index.css                 # Root styles
│
│
├── App.tsx                 # Root application component
└── main.jsx                # Application entry point
```
