# DigiDeck Portal

A fully functional, scalable Digimon TCG companion platform built with React, TypeScript, Vite, Firebase, and Three.js. Features live tournament data, immersive 3D experiences, and comprehensive meta analysis.

## 🚀 Features

### Core Functionality
- **Live Card Database**: Real-time Digimon TCG card data with advanced search and filtering
- **Tournament Meta Analysis**: Live tournament results and deck performance tracking
- **Immersive 3D Experience**: Digital World background with Three.js animations
- **Data-Driven Insights**: Charts, graphs, and analytics from real competitive data

### Pages & Tools
- `/cards` - Searchable card database with filters
- `/meta` - Tournament results and archetype analysis  
- `/intel` - Performance dashboards and trend analysis
- `/radar` - Regional meta breakdown by archetype
- `/synergy` - Card combination analysis from real decks
- `/tools` - Deck building utilities and calculators
- `/profile` - User profiles with evolving partner Digimon
- `/chaos` - Challenge mode with randomized constraints

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom Digimon theme
- **3D Graphics**: Three.js with React Three Fiber
- **Backend**: Firebase (Firestore, Functions, Hosting)
- **Data Sources**: Live scraping from Digimon card databases and tournament sites
- **Animations**: Framer Motion for smooth transitions

## 📦 Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd digideck-portal
npm install
```

2. **Set up Firebase**:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init
```

3. **Configure environment variables**:
```bash
cp .env.example .env
# Edit .env with your Firebase configuration
```

4. **Install Functions dependencies**:
```bash
cd functions
npm install
cd ..
```

## 🔧 Development

### Start development server:
```bash
npm run dev
```

### Run data scrapers locally:
```bash
npm run scrape:cards
npm run scrape:decks
```

### Test Firebase Functions locally:
```bash
cd functions
npm run serve
```

## 🚀 Deployment

### Build and deploy to Firebase:
```bash
npm run deploy
```

### Deploy functions only:
```bash
cd functions
npm run deploy
```

## 📊 Data Sources

### Card Data
- Primary: `https://digimoncard.dev/cards`
- Backup: Community card databases
- Updates: Daily via Firebase Functions

### Tournament Data  
- Primary: `https://digimonmeta.com/tournaments`
- Secondary: `https://play.limitlesstcg.com/tournaments`
- Updates: Daily post-tournament via automated scraping

## 🎨 Design System

### Colors
- **Primary Blue**: `#00a8ff` (digi-blue)
- **Secondary Orange**: `#ff6b35` (digi-orange)  
- **Accent Purple**: `#8b5cf6` (digi-purple)
- **Success Green**: `#00d2d3` (digi-green)
- **Dark Background**: `#0f0f23` (digi-dark)
- **Card Background**: `#1a1a2e` (digi-gray)

### Components
- **digi-card**: Standard card component with hover effects
- **digi-button**: Gradient buttons with animations
- **digi-input**: Themed form inputs
- **digi-glow**: Glowing animation utility

## 🔄 Data Flow

1. **Scraping Pipeline**: Firebase Functions run daily to fetch fresh data
2. **Data Storage**: Firestore collections for cards, decks, and meta data
3. **Real-time Updates**: Live sync between database and frontend
4. **Caching**: Optimized queries with Firestore indexes

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive navigation with mobile menu
- Optimized card layouts for all screen sizes
- Touch-friendly interactions

## 🎮 3D Features

### EggLoader
- Animated DigiEgg with cracking sequence
- Particle effects and lighting
- Smooth transition to main app

### Digital World Background
- Floating digital particles
- Orbiting wireframe objects
- Animated grid with fog effects
- Parallax scrolling elements

## 🔐 Security

- Firestore security rules for data protection
- Environment variables for sensitive configuration
- CORS configuration for API endpoints
- Input validation and sanitization

## 📈 Performance

- Code splitting with React.lazy
- Image optimization and lazy loading
- Firestore query optimization with indexes
- CDN delivery via Firebase Hosting

## 🧪 Testing

Run the development server and test core functionality:

1. **Card Search**: Navigate to `/cards` and test filtering
2. **Meta Analysis**: Check `/meta` for tournament data
3. **3D Animations**: Verify loader and background animations
4. **Responsive Design**: Test on mobile and desktop

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the GitHub Issues page
2. Review Firebase console for function logs
3. Test data scraping endpoints manually
4. Verify environment configuration

---

**Built with ❤️ for the Digimon TCG community**