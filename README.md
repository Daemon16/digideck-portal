# DigiDeck Portal

A modern Digimon TCG companion platform built with React, TypeScript, Vite, and Firebase. Features tournament data analysis, user profiles with achievements, and an immersive Cyber Sleuth-inspired design.

## 🚀 Features

### Core Functionality
- **Live Card Database**: Searchable Digimon TCG card database with advanced filtering
- **Tournament Meta Analysis**: Real tournament deck analysis and performance tracking
- **User Profiles**: Firebase Authentication with activity tracking and achievements
- **Digital Portal**: Animated loading experience with hexagonal tech design
- **Cyber Sleuth Theme**: Teal/orange color scheme with futuristic UI elements

### Pages & Tools
- `/cards` - Searchable card database with modal details
- `/meta` - Tournament deck analysis by set with load more functionality
- `/intel` - Meta statistics and top archetype breakdowns
- `/radar` - Regional tournament performance analysis
- `/profile` - User authentication, stats tracking, and partner evolution
- `/tools` - Deck building utilities (coming soon)
- `/synergy` - Card combination analysis (coming soon)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Mantine UI with custom Cyber Sleuth theme
- **Backend**: Firebase (Firestore, Authentication)
- **Animations**: Framer Motion for smooth transitions
- **Deployment**: Vercel with environment variables
- **Data**: Tournament data from Digimon Meta sources

## 📦 Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd digideck-portal/src/digideck-portal
npm install
```

2. **Configure environment variables**:
```bash
cp .env.example .env
# Edit .env with your Firebase configuration
```

3. **Set up Firebase**:
- Create a Firebase project
- Enable Authentication (Email/Password)
- Create Firestore database
- Deploy security rules: `firebase deploy --only firestore:rules`

## 🔧 Development

### Start development server:
```bash
npm run dev
```

### Build for production:
```bash
npm run build
```

## 🚀 Deployment

### Deploy to Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Redeploy with production flag
vercel --prod
```

### Firebase Setup:
- Add your Vercel domain to Firebase authorized domains
- Deploy Firestore rules: `firebase deploy --only firestore:rules`

## 📊 Data Sources

### Tournament Data  
- Primary: Digimon Meta tournament results
- Processing: Real-time deck analysis and statistics
- Storage: Firebase Firestore with optimized queries

## 🎨 Design System

### Cyber Sleuth Theme
- **Primary Teal**: `#00d2d3` (cyber-cyan)
- **Secondary Orange**: `#ff6b35` (cyber-orange)  
- **Accent Purple**: `#8b5cf6` (cyber-purple)
- **Dark Background**: `#0f0f23` to `#1a1a2e` gradients
- **Glass Effects**: Backdrop blur with translucent cards

### Components
- **Digital Portal**: Hexagonal loading animation
- **Cyber Cards**: Glass morphism with gradient borders
- **Tech Particles**: Animated geometric elements
- **Gradient Buttons**: Cyber-themed interactive elements

## 🔄 Data Flow

1. **User Authentication**: Firebase Auth with email/password
2. **Activity Tracking**: Real-time stats for cards viewed and decks analyzed
3. **Achievement System**: Unlockable achievements based on user activity
4. **Data Storage**: Firestore collections with security rules

## 📱 Responsive Design

- Mobile-first approach with Mantine UI
- Responsive grid layouts for all screen sizes
- Touch-friendly interactions and hover effects
- Optimized animations for mobile devices

## 🎮 Visual Features

### Digital Portal
- Hexagonal tech portal animation
- Multi-stage loading sequence
- Cyber-themed particle effects
- Smooth transition to main app

### Cyber Background
- Animated digital grid patterns
- Floating geometric particles
- Scan line effects
- Hexagonal UI elements

## 🔐 Security

- Firestore security rules for user data protection
- Firebase Authentication for secure user management
- Environment variables for sensitive configuration
- User-specific data access controls

## 📈 Performance

- Code splitting with React.lazy
- Optimized Firestore queries with pagination
- Efficient state management with custom hooks
- Fast deployment via Vercel CDN

## 🧪 Testing

Run the development server and test core functionality:

1. **User Registration**: Create account and verify profile
2. **Card Search**: Navigate to `/cards` and test filtering
3. **Meta Analysis**: Check `/meta` for tournament data
4. **Activity Tracking**: Verify stats increment on interactions
5. **Responsive Design**: Test on mobile and desktop

## ⚖️ Legal

Digimon and all related characters are trademarks of Bandai. This is an unofficial fan-made project not affiliated with or endorsed by Bandai, Toei Animation, or any official Digimon entity.

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
2. Review Firebase console for authentication logs
3. Verify environment variables in Vercel
4. Test Firestore security rules

---

**Built with ❤️ for the Digimon TCG community**