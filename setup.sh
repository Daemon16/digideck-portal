#!/bin/bash

echo "🚀 Setting up DigiDeck Portal..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install function dependencies
echo "📦 Installing Firebase Functions dependencies..."
cd functions
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your Firebase configuration"
fi

# Initialize Firebase (optional)
read -p "🔥 Do you want to initialize Firebase project? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    firebase login
    firebase init
fi

# Seed initial data (optional)
read -p "🌱 Do you want to seed initial card and deck data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding initial data..."
    npm run scrape:cards
    npm run scrape:decks
fi

echo "✅ Setup complete!"
echo ""
echo "🎮 Next steps:"
echo "1. Edit .env file with your Firebase configuration"
echo "2. Run 'npm run dev' to start development server"
echo "3. Run 'npm run deploy' to deploy to Firebase"
echo ""
echo "📚 Documentation: Check README.md for detailed instructions"
echo "🎯 Happy coding with DigiDeck Portal!"