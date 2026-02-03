# Flight Spotter | Folder Structure

```text
flight-spotter/
├── public/                 # Static assets
│   ├── icon.svg            # Official flight icon
│   └── images/             # Local optimized imagery
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── actions/        # Server Actions (Amadeus & Gemini)
│   │   │   ├── flight.ts   # Amadeus technical integration
│   │   │   ├── predict.ts  # Gemini AI logic
│   │   │   └── ...
│   │   ├── flights/        # Flight search results page
│   │   └── ...
│   ├── components/         # React Components
│   │   ├── ui/             # Reusable UI primitives (Button, etc.)
│   │   ├── FlightCard.tsx  # Core result display
│   │   ├── PriceGraph.tsx  # D3 visualization
│   │   ├── SearchForm.tsx  # Segmented input form
│   │   └── ...
│   ├── constants/          # Static data and landing content
│   ├── lib/                # Shared utilities and state
│   │   ├── store.ts        # Zustand state management
│   │   ├── smartSearch.ts  # Caching and pre-fetching logic
│   │   └── firebase.ts     # Auth configuration
│   └── ...
├── architecture.md         # Production Blueprint
├── README.md               # User documentation
├── package.json            # Dependencies and scripts
└── ...
```
