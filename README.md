# iJerdTopup - Game Top-Up E-Commerce Site

A modern, minimalist React application for game top-up services built with Vite and Tailwind CSS.

## Features

- 🎮 Game product display from Firebase Firestore
- 🎨 Minimalist design with orange (#F97316) and white color scheme
- ⚡ Fast development with Vite
- 🔥 Firebase Firestore integration
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a `.env` file based on `.env.example`
   - Add your Firebase configuration credentials

4. Set up Firestore:
   - Create a collection named `games` in your Firestore database
   - Add documents with the following structure:
     ```json
     {
       "name": "Game Name",
       "description": "Game description",
       "price": 9.99,
       "image": "https://image-url.com/game.jpg"
     }
     ```

### Development

Run the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   └── LandingPage.jsx
├── config/          # Configuration files
│   └── firebase.js
├── hooks/           # Custom React hooks
│   └── useGames.js
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles with Tailwind
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Get your Firebase config from Project Settings
5. Add the config to your `.env` file

## License

MIT
# ijerd-topup
