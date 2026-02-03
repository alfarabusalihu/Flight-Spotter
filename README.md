# Flight Spotter 🛫

A modern, AI-powered flight search engine with real-time pricing intelligence, premium UI, and privacy-first architecture.

## ✨ Key Features

- **Real-Time Flight Search**: Live pricing powered by Amadeus Global Distribution System
- **AI Price Intelligence**: 14-day predictive price trends using Gemini 2.0 Flash
- **Auth-Gated Geolocation**: Secure, permission-based location features for verified users
- **Smart Split Layout**: Responsive 60/40 desktop layout with sticky insights panel
- **Destination Insights**: AI-generated attraction guides and local recommendations
- **Premium Visualizations**: Custom D3.js price graphs and market distribution charts
- **Smart Search**: Intelligent pre-fetching and in-memory caching
- **Universal Theming**: Seamless light/dark mode transitions with glassmorphism
- **Zero Storage**: No localStorage/sessionStorage - pure in-memory state with Zustand + Firebase

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, Server Actions, Turbopack)
- **UI**: React 19.2.3, Tailwind CSS 4, Framer Motion 12
- **State**: Zustand 5.0.11 (sliced store architecture)
- **AI**: Google Generative AI (Gemini 2.0 Flash)
- **Flight Data**: Amadeus Self-Service APIs
- **Auth**: Firebase Authentication (Google OAuth)
- **Charts**: D3.js 7.9.0
- **Styling**: Glassmorphism, Dark Cyan theme (`#0d9488`)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Amadeus API credentials (free tier available)
- Google Gemini API key
- Firebase project (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flight-spotter.git
   cd flight-spotter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Amadeus API (Required)
   amadeus_api_key=your_amadeus_key
   amadeus_api_secret=your_amadeus_secret
   AMADEUS_ENVIRONMENT=sandbox  # or 'production'
   
   # Google Gemini AI (Required)
   GEMINI_API_KEY=your_gemini_api_key
   
   # Firebase Auth (Required for location features)
   NEXT_PUBLIC_apiKey=your_firebase_api_key
   NEXT_PUBLIC_authDomain=your_project.firebaseapp.com
   NEXT_PUBLIC_projectId=your_project_id
   NEXT_PUBLIC_storageBucket=your_project.appspot.com
   NEXT_PUBLIC_messagingSenderId=your_sender_id
   NEXT_PUBLIC_appId=your_app_id
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 🐳 Docker Deployment

```bash
# Build the image
docker build -t flight-spotter .

# Run the container
docker run -p 3000:3000 --env-file .env flight-spotter
```

## 📁 Project Structure

See [`FOLDER_STRUCTURE.md`](./FOLDER_STRUCTURE.md) for detailed architecture.

## 🔒 Privacy & Security

- **No Local Storage**: Zero use of localStorage or sessionStorage
- **In-Memory State**: All state managed via Zustand (clears on page refresh)
- **Firebase Sessions**: Authentication persists via Firebase (secure HTTP-only cookies)
- **Location Privacy**: User location never stored or shared
- **API Security**: All API keys server-side only

## 🎨 Design System

- **Colors**: Dark Cyan (`#0d9488`), Dark Cyan Light (`#14b8a6`)
- **Typography**: Display font (headings), Sans font (body)
- **Effects**: Glassmorphism, backdrop-blur, rounded corners
- **Animations**: Framer Motion for smooth transitions

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build verification
npm run build
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

---

**Built with ❤️ using Next.js, Zustand, and AI**
