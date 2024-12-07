const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redisService = require('../services/redis');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No authentication token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisService.client.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new Error('Token has been revoked');
    }

    // Update user's last seen
    user.lastSeen = new Date();
    await user.save();

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new Error('No authentication token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisService.client.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new Error('Token has been revoked');
    }

    // Store user data in socket
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new Error('Admin access required');
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};

const isModerator = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findOne({ id: roomId });
    
    if (!room) {
      throw new Error('Room not found');
    }

    const isMod = room.moderators.some(mod => mod.toString() === req.user._id.toString());
    if (!isMod) {
      throw new Error('Moderator access required');
    }
    
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};

module.exports = {
  auth,
  socketAuth,
  isAdmin,
  isModerator
};
