# 2048 Game

A modern implementation of the classic 2048 game built with React, TypeScript, and Framer Motion. This version features a responsive design that adapts beautifully to any screen size.

## Live Demo

[Play the game here](https://potikorn.github.io/2048-with-windsurf/) 

## Features

- 🎮 Smooth animations powered by Framer Motion
- 📱 Fully responsive design that works on all devices
- ⌨️ Keyboard and touch controls
- 🏆 Score tracking with best score persistence
- 🎨 Modern UI with clean aesthetics
- 🔄 "New Game" functionality
- 🚫 No scrolling issues during gameplay

## Tech Stack

- React 18
- TypeScript
- Emotion (Styled Components)
- Framer Motion
- Vite
- GitHub Pages

## Project Structure

```
2048/
├── src/
│   ├── components/        # React components
│   │   ├── Grid/         # Game grid components
│   │   ├── Score/        # Score components
│   │   └── GameOver/     # Game over overlay
│   ├── store/            # Game state management
│   ├── utils/            # Helper functions
│   └── App.tsx           # Root component
├── scripts/              # Deployment scripts
└── package.json          # Project configuration
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/2048.git
cd 2048
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## Recent Updates

- Added responsive design that maintains perfect alignment between score board and game grid
- Fixed scrolling issues when using arrow keys
- Improved touch controls and keyboard handling
- Enhanced visual feedback and animations
- Optimized layout for various screen sizes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
