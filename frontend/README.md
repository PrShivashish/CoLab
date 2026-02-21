# CoLab

**CoLab** is a real-time collaborative code editor that enables multiple users to write and edit code simultaneously in shared virtual rooms.

## Features

- 🚀 **Real-time Collaboration** - Multiple users can edit code simultaneously
- 🔄 **Live Synchronization** - Instant code updates across all connected clients
- 👥 **User Presence** - See who's currently in your coding session
- 🎨 **Syntax Highlighting** - Beautiful code highlighting with PrismJS
- 🔗 **Easy Sharing** - Share room IDs to invite collaborators
- ⚡ **Fast & Responsive** - Built with React + Vite for optimal performance

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Editor**: react-simple-code-editor with PrismJS
- **Real-time**: WebSocket communication

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local URL shown in the terminal

## How to Use

1. **Create a Room** - Click "Create Room" to generate a unique room ID
2. **Enter Username** - Type your name
3. **Join Room** - Click "Join Room" to enter the collaborative editor
4. **Share** - Copy the room ID and share it with others to collaborate in real-time!

## Building for Production

```bash
npm run build
npm run preview
```
