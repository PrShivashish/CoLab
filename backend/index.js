import 'dotenv/config';

import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from 'node:path';
import { Server } from 'socket.io';
import { Socket } from 'node:dgram';
import cors from "cors";
import codeExecutionService from './services/codeExecutionService.js';
import jwt from 'jsonwebtoken';
import aiRoutes from './routes/ai.js';

const app = express();

// Middleware
app.use(cors({
  origin: "*",
}));
app.use(express.json()); // Parse JSON request bodies



const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


const __dirname = dirname(fileURLToPath(import.meta.url));

// serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// ============= REST API Endpoints for Code Execution =============

// Execute code
app.post('/api/execute', async (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required',
      });
    }

    const result = await codeExecutionService.execute(code, language, stdin);

    // If execution failed and we have an error, offer AI debug assist
    if (!result.success && result.run?.stderr) {
      try {
        const geminiService = (await import('./services/geminiService.js')).default;
        const debugHelp = await geminiService.debugError(
          result.run.stderr,
          code,
          language
        );
        result.aiDebugHelp = debugHelp.analysis;
      } catch (aiError) {
        // Silently fail AI debug - don't block execution result
        console.log('AI debug assist unavailable:', aiError.message);
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get supported languages
app.get('/api/languages', (req, res) => {
  const languages = codeExecutionService.getSupportedLanguages();
  res.json({
    success: true,
    languages,
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Co Lab API is running',
    timestamp: new Date().toISOString(),
  });
});

// AI Routes
app.use('/api/ai', aiRoutes);

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'colab-secret-key-change-in-production';

// Generate room invite link
app.post('/api/room/generate-link', (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        error: 'Room ID is required',
      });
    }

    // Generate JWT token (expires in 24 hours)
    const token = jwt.sign(
      { roomId, type: 'room-invite' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      inviteLink: `${req.headers.origin || 'http://localhost:5173'}/join?token=${token}`,
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Validate room token
app.post('/api/room/validate-token', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      success: true,
      roomId: decoded.roomId,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
});

// ============= WebSocket for Real-time Collaboration =============

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      }
    }
  ) //
}

//connection is instatiated to be ma



//fixed
io.on("connection", (socket) => {
  console.log(`user connected : ${socket.id}`);

  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    console.log(clients)
    console.log(roomId)

    // broadcast to everyone in room
    io.to(roomId).emit("joined", {
      clients,
      username,
      socketId: socket.id,
    });
  });

  socket.on("disconnecting", () => {
    const username = userSocketMap[socket.id];

    // remove user BEFORE recalculating clients
    delete userSocketMap[socket.id];

    socket.rooms.forEach((roomId) => {
      if (roomId === socket.id) return;

      const clients = getAllConnectedClients(roomId);

      io.to(roomId).emit("disconnected", {
        socketId: socket.id,
        username,
        clients,
      });
    });
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected : ${socket.id}`);
  });


  //code sync logic
  socket.on("code-change", ({ roomId, code }) => {
    // console.log("code recieve dfrom" , roomId);
    // console.log("code length ", code.length)
    socket.to(roomId).emit("code-changed", { code });
  })

  // here i listend to the new joinee and sending the code to him
  socket.on("sync-code", ({ code, socketId }) => {
    io.to(socketId).emit("code-changed", { code });
  })

  // Language sync logic
  socket.on("language-change", ({ roomId, language }) => {
    socket.to(roomId).emit("language-changed", { language });
  });

  // Sync language to new joinee
  socket.on("sync-language", ({ language, socketId }) => {
    io.to(socketId).emit("language-changed", { language });
  });


});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server is running at port : ${PORT}`);
});

