const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['public', 'private', 'direct'],
    default: 'public'
  },
  capacity: {
    type: Number,
    default: 1000
  },
  activeUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  }],
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bannedUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    bannedAt: {
      type: Date,
      default: Date.now
    },
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expiresAt: Date
  }],
  settings: {
    slowMode: {
      enabled: {
        type: Boolean,
        default: false
      },
      delay: {
        type: Number,
        default: 0
      }
    },
    messageRetention: {
      type: Number,
      default: 30 // days
    },
    allowImages: {
      type: Boolean,
      default: true
    },
    allowFiles: {
      type: Boolean,
      default: true
    },
    maxFileSize: {
      type: Number,
      default: 5242880 // 5MB
    },
    languages: [{
      type: String,
      default: ['en']
    }]
  },
  metadata: {
    region: String,
    tags: [String],
    customEmojis: [{
      name: String,
      url: String
    }]
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
roomSchema.index({ id: 1 });
roomSchema.index({ type: 1 });
roomSchema.index({ 'metadata.tags': 1 });

// Methods
roomSchema.methods.isUserBanned = async function(userId) {
  const ban = this.bannedUsers.find(ban => 
    ban.user.toString() === userId.toString() && 
    (!ban.expiresAt || ban.expiresAt > new Date())
  );
  return !!ban;
};

roomSchema.methods.isFull = function() {
  return this.activeUsers.length >= this.capacity;
};

roomSchema.methods.addUser = async function(userId) {
  if (await this.isUserBanned(userId)) {
    throw new Error('User is banned from this room');
  }
  
  if (this.isFull()) {
    throw new Error('Room is at capacity');
  }

  const existingUser = this.activeUsers.find(u => u.user.toString() === userId.toString());
  if (!existingUser) {
    this.activeUsers.push({ user: userId });
    await this.save();
  }
};

roomSchema.methods.removeUser = async function(userId) {
  this.activeUsers = this.activeUsers.filter(u => u.user.toString() !== userId.toString());
  await this.save();
};

module.exports = mongoose.model('Room', roomSchema);
