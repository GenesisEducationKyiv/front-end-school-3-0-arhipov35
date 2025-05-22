# MusicApp

A modern, feature-rich music application built with React, TypeScript, Redux, and Vite. MusicApp allows users to explore, manage, and enjoy their music collection with a clean and intuitive interface.

## Features

- 🎵 Browse, search, and filter music tracks
- 🏷️ Tag management for organizing tracks
- 📂 Playlists creation and management
- 🔍 Powerful search and filtering
- 🎧 Responsive and modern UI (Bootstrap + SASS)
- 🔄 State management with Redux Toolkit
- ⚡ Fast development with Vite

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Running the App
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Building for Production
```bash
npm run build
```

## Extra Tasks Implemented

The following additional features have been implemented beyond the basic requirements:

- **Bulk Delete Functionality**: Users can select multiple tracks or use "Select All" option to delete tracks in bulk, improving efficiency when managing large music collections.
- **Optimistic Updates**: UI changes are reflected immediately before server confirmation, providing a smoother and more responsive user experience. If a server error occurs, the UI gracefully reverts to its previous state.
- **Audio Wave Visualization**: Added real-time waveform visualization for the currently playing track, enhancing the visual feedback during music playback.

## Technologies Used
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router DOM](https://reactrouter.com/)
- [Bootstrap 5](https://getbootstrap.com/)
- [SASS](https://sass-lang.com/)
- [Vite](https://vitejs.dev/)

## Project Structure
```
my-music-app/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and icons
│   ├── contexts/          # React context providers (ToastContext)
│   ├── features/          # Feature-based modules
│   │   ├── audio/         # Audio playback and visualization
│   │   │   ├── components/ # AudioPlayer, AudioVisualizer
│   │   │   ├── hooks/     # useAudioPlayer, useAudioManager
│   │   │   └── utils/     # audioUtils
│   │   └── tracks/        # Track management functionality
│   │       ├── api/       # RTK Query API endpoints
│   │       ├── components/ # TrackList, TrackForm, TrackFileUpload
│   │       └── hooks/     # useTrackFilters
│   ├── shared/            # Shared components
│   │   └── components/    # Reusable UI components (Modal, Loader, Toast)
│   ├── store/             # Redux store configuration
│   ├── styles/            # Global and modular styles (SCSS)
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── package.json
├── vite.config.ts
└── README.md
```

**MusicApp** — *Where code meets melody* 🎵
