# Endless RPG - Raid Boss Card Game

A card-based RPG game built with React where players battle through endless rounds of enemies using strategic card play.

## Game Features

- Card-based Combat: Use various attack, defense, and utility cards
- Progressive Difficulty: Enemies scale with rounds
- Deck Building: Add new cards to your deck as rewards
- Status Effects: Empower attacks and counter enemy damage
- Boss Battles: Special encounters every 15 rounds

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/InsaneReaper7/endlessrpg.git
cd endlessrpg
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## Project Structure

```
endlessrpg/
├── public/
│   ├── index.html          # Main HTML entry point
│   └── styles.css          # Game styles
├── src/
│   ├── components/         # React components
│   │   ├── overlays/       # Modal/overlay components
│   │   ├── Game.js         # Main game component
│   │   ├── GameBoard.js    # Game board layout
│   │   ├── StatusBar.js    # Player status display
│   │   ├── EnemiesContainer.js
│   │   ├── EnemyCard.js
│   │   ├── HandContainer.js
│   │   ├── CardComponent.js
│   │   ├── MainMenu.js
│   │   ├── TalentsScreen.js
│   │   └── SplashScreen.js
│   ├── hooks/              # Custom React hooks
│   │   ├── useGameState.js # Main game state management
│   │   └── useGameActions.js # Game action handlers
│   ├── data/               # Game data definitions
│   │   └── cardTypes.js    # Card definitions
│   ├── utils/              # Utility functions
│   │   └── helpers.js      # Game helper functions
│   └── main.js             # Application entry point
├── assets/
│   └── images/             # Game sprites and images
├── package.json
├── vite.config.js          # Vite configuration
└── .eslintrc.json          # ESLint configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## How to Play

1. Start a Run: Begin with a basic deck of 8 cards
2. Combat: Use cards to attack enemies and manage resources
3. Energy System: Cards cost energy, refills each turn
4. Deck Building: Add new cards as rewards after each round
5. Strategy: Build synergies between cards and manage your deck

### Card Types
- Attack Cards: Deal damage to enemies
- Utility Cards: Provide energy, card draw, or other benefits
- Status Cards: Apply temporary effects like Empower or Counter

## Known Issues

- Talents system is placeholder
- No save/load functionality
- Limited enemy variety
- No sound effects or advanced animations

## Contributors

- **Luis Cruz** - Repository Owner
- **Anthony Colon** (@anthonyjomarq) - Contributor

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check code quality
5. Submit a pull request

## License

MIT License - see LICENSE file for details