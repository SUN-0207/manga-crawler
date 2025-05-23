# Manga Crawler

A TypeScript-based manga crawler application with a modern web interface for downloading and managing manga chapters.

## Features

- Real-time manga chapter downloads with progress tracking
- Web-based user interface built with React and Material-UI
- WebSocket-based real-time updates
- Queue management for multiple downloads
- Pause/Resume functionality for downloads
- Automatic retry mechanism for failed downloads
- Rate limiting and anti-bot detection measures

## Project Structure

```
manga-crawler/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API and WebSocket services
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main App component
│   ├── package.json        # Frontend dependencies
│   └── tsconfig.json       # Frontend TypeScript config
│
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Main server file
│   ├── package.json        # Backend dependencies
│   └── tsconfig.json       # Backend TypeScript config
│
└── package.json            # Root package.json for managing both apps
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- TypeScript (v4 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd manga-crawler
```

2. Install all dependencies:
```bash
npm run install:all
```

This will install dependencies for both frontend and backend applications.

## Development

To run the application in development mode:

```bash
npm run dev
```

This will start both the frontend and backend servers:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Building for Production

To build both frontend and backend for production:

```bash
npm run build
```

This will create optimized production builds in:
- Frontend: `frontend/build`
- Backend: `backend/dist`

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Enter the manga URL in the input field
3. Click "Add to Queue" to start downloading
4. Monitor download progress in real-time
5. Use the pause/resume buttons to control downloads
6. Remove items from the queue as needed

## Features in Detail

### Frontend
- Modern Material-UI based interface
- Real-time progress updates via WebSocket
- Download queue management
- Pause/Resume functionality
- Error handling and retry mechanisms

### Backend
- Express.js server with Socket.IO integration
- Puppeteer-based web scraping with anti-detection measures
- Queue management system
- Rate limiting and retry mechanisms
- File system management for downloads

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React and Material-UI for the frontend framework
- Express.js and Socket.IO for the backend
- Puppeteer for web scraping capabilities
