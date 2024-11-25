# 2048 Game

A modern implementation of the classic 2048 game using vanilla JavaScript with a focus on clean code and maintainability.

## Features

- Responsive design that works on both desktop and mobile
- Smooth animations and transitions
- Touch and keyboard controls
- Score tracking
- Game state management

## Project Structure

```
2048/
├── src/                    # Source files
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript modules
│   │   ├── Game.js        # Main game coordinator
│   │   ├── GameState.js   # Game logic
│   │   └── UIManager.js   # UI management
│   └── __tests__/         # Test files
├── dist/                   # Production build
└── package.json           # Project configuration
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build:prod
```

## Development

- `npm start` - Start development server
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run format` - Format code
- `npm run build` - Build for development
- `npm run build:prod` - Build for production

## Code Style

This project uses ESLint and Prettier to maintain code quality and consistent style. Run `npm run lint` to check your code and `npm run format` to automatically format it.

## Testing

Tests are written using Jest and can be found in the `src/__tests__` directory. Run `npm test` to execute the test suite.

## License

MIT
