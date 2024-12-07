require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const Filter = require('bad-words');
const path = require('path');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Socket.IO setup with improved error handling
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5175",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  maxHttpBufferSize: 5e6 // 5MB
});

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Profanity filter
const filter = new Filter();

// In-memory storage
const activeUsers = new Map();
const typingUsers = new Map();
const messages = new Map();
const rooms = new Map([
  ['general', {
    id: 'general',
    name: 'General Chat',
    description: 'Public chat room for everyone',
    type: 'public',
    messages: []
  }],
  ['tech', {
    id: 'tech',
    name: 'Tech Talk',
    description: 'Discuss technology and programming',
    type: 'public',
    messages: []
  }],
  ['social', {
    id: 'social',
    name: 'Social Hub',
    description: 'Chat about anything and everything',
    type: 'public',
    messages: []
  }]
]);

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log('New client connected:', socket.id);

  try {
    // For now, we'll use a simple authentication
    const userId = socket.handshake.auth.userId || 'anonymous';
    const username = socket.handshake.auth.username || 'Anonymous';
    
    // Store user info
    activeUsers.set(socket.id, {
      _id: userId,
      username: username,
      status: 'online'
    });

    // Send available rooms to client
    socket.emit('rooms', Array.from(rooms.values()));

    // Handle joining a room
    socket.on('join_room', async ({ roomId }) => {
      try {
        const room = rooms.get(roomId);
        if (!room) {
          throw new Error('Room not found');
        }

        // Leave current room if any
        const currentRoom = Array.from(socket.rooms)[1];
        if (currentRoom) {
          socket.leave(currentRoom);
        }

        // Join new room
        socket.join(roomId);

        // Get recent messages
        const roomMessages = room.messages.slice(-50);
        socket.emit('message_history', roomMessages);

        // Broadcast user joined
        io.to(roomId).emit('user_joined', {
          user: activeUsers.get(socket.id),
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Room join error:', error);
        socket.emit('error', { 
          type: 'room_join_error',
          message: error.message 
        });
      }
    });

    // Handle messages
    socket.on('message', async (data) => {
      try {
        const room = rooms.get(data.room);
        if (!room) {
          throw new Error('Room not found');
        }

        // Filter profanity
        const cleanContent = filter.clean(data.content);

        // Create message
        const message = {
          _id: Date.now().toString(),
          room: data.room,
          sender: activeUsers.get(socket.id),
          content: cleanContent,
          type: data.type || 'text',
          metadata: data.metadata || {},
          createdAt: new Date()
        };

        // Store message
        room.messages.push(message);
        if (room.messages.length > 1000) {
          room.messages.shift(); // Keep only last 1000 messages
        }

        // Broadcast message
        io.to(data.room).emit('message', message);

      } catch (error) {
        console.error('Message handling error:', error);
        socket.emit('error', { 
          type: 'message_error',
          message: error.message 
        });
      }
    });

    // Handle typing status
    socket.on('typing', ({ room, isTyping }) => {
      try {
        const roomTyping = typingUsers.get(room) || new Set();
        if (isTyping) {
          roomTyping.add(socket.id);
        } else {
          roomTyping.delete(socket.id);
        }
        typingUsers.set(room, roomTyping);

        // Get usernames of typing users
        const typingUsernames = Array.from(roomTyping)
          .map(id => activeUsers.get(id)?.username)
          .filter(Boolean);

        io.to(room).emit('typing_users', typingUsernames);
      } catch (error) {
        console.error('Typing status error:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      try {
        // Remove user from active users
        activeUsers.delete(socket.id);

        // Remove user from typing in all rooms
        for (const [room, users] of typingUsers.entries()) {
          users.delete(socket.id);
          if (users.size === 0) {
            typingUsers.delete(room);
          }
        }

        // Leave all rooms
        const rooms = Array.from(socket.rooms);
        for (const room of rooms) {
          if (room !== socket.id) {
            socket.leave(room);
          }
        }
      } catch (error) {
        console.error('Disconnect handling error:', error);
      }
    });

  } catch (error) {
    console.error('Socket connection error:', error);
    socket.emit('error', { 
      type: 'connection_error',
      message: 'Failed to establish connection' 
    });
    socket.disconnect(true);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server with improved error handling
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (error) => {
  console.error('Server startup error:', error);
  process.exit(1);
});

// Handle process errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});
