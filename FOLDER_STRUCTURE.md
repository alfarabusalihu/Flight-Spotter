# Flight Spotter | Folder Structure

```text
flight-spotter/
├── public/                      # Static assets
│   ├── icon.svg                 # App icon
│   └── images/                  # Optimized images
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── actions/             # Server Actions
│   │   │   ├── flight.ts        # Amadeus API integration
│   │   │   ├── predict.ts       # Gemini AI predictions
│   │   │   └── insights.ts      # Destination insights
│   │   ├── flights/             # Flight results page
│   │   ├── about/               # About page
│   │   ├── privacy/             # Privacy policy
│   │   ├── terms/               # Terms of service
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   │
│   ├── components/              # React Components
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx       # Navigation header
│   │   │   ├── Footer.tsx       # Footer
│   │   │   ├── Auth.tsx         # Auth component
│   │   │   └── ThemeToggle.tsx  # Theme switcher
│   │   ├── search/              # Search-related
│   │   │   ├── LocationInput.tsx
│   │   │   ├── FilterDropdown.tsx
│   │   │   └── SearchLoadingBar.tsx
│   │   ├── ui/                  # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── FlightCard.tsx       # Flight result card
│   │   ├── FlightResults.tsx    # Results list
│   │   ├── PriceGraph.tsx       # D3.js price chart
│   │   ├── SearchForm.tsx       # Main search form
│   │   ├── LocationPermissionDialog.tsx
│   │   ├── LocationOnboardingBanner.tsx
│   │   ├── TouristPlaces.tsx    # Destination insights
│   │   └── ...
│   │
│   ├── lib/                     # Core utilities
│   │   ├── store/               # Zustand store slices
│   │   │   ├── index.ts         # Slice exports
│   │   │   └── slices/
│   │   │       ├── searchSlice.ts
│   │   │       ├── resultsSlice.ts
│   │   │       ├── uiSlice.ts
│   │   │       ├── localizationSlice.ts
│   │   │       └── discoverySlice.ts
│   │   ├── store.ts             # Main Zustand store assembly
│   │   ├── smartSearch.ts       # Pre-fetching logic
│   │   ├── locationCache.ts     # In-memory location cache
│   │   ├── firebase.ts          # Firebase auth config
│   │   ├── amadeus.ts           # Amadeus client
│   │   └── utils.ts             # Helper functions
│   │
│   ├── types/                   # TypeScript types
│   │   ├── index.ts             # Core types
│   │   ├── location.ts          # Location types
│   │   ├── flight.ts            # Flight types
│   │   ├── store.ts             # Store types
│   │   ├── search.ts            # Search types
│   │   └── components.ts        # Component props
│   │
│   ├── constants/               # Static data
│   │   ├── localizationData.ts  # Currency/language data
│   │   └── ...
│   │
│   └── styles/                  # Global styles
│       └── globals.css          # Tailwind + custom CSS
│
├── .env                         # Environment variables (gitignored)
├── .gitignore                   # Git ignore rules
├── Dockerfile                   # Docker configuration
├── docker-compose.yml           # Docker Compose (optional)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
├── README.md                    # Project documentation
└── FOLDER_STRUCTURE.md          # This file
```

## Key Architectural Decisions

### State Management
- **Zustand Store**: Sliced architecture for modularity
- **No Browser Storage**: Zero localStorage/sessionStorage usage
- **In-Memory Only**: All state clears on page refresh

### Authentication
- **Firebase Auth**: Google OAuth integration
- **Session Persistence**: Handled by Firebase (secure cookies)
- **Auth-Gated Features**: Location detection requires login

### API Integration
- **Server Actions**: All API calls server-side only
- **Amadeus**: Flight search and location data
- **Gemini AI**: Price predictions and destination insights

### Styling
- **Tailwind CSS 4**: Utility-first styling
- **Glassmorphism**: Modern UI effects
- **Framer Motion**: Smooth animations
- **Responsive**: Mobile-first with breakpoints (md, lg, xl, 2xl)
