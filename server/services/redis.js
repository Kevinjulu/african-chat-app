const Redis = require('redis');

class RedisService {
  constructor() {
    this.client = null;
    this.subscriber = null;
    this.publisher = null;
  }

  async connect() {
    try {
      this.client = Redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      this.subscriber = this.client.duplicate();
      this.publisher = this.client.duplicate();

      await Promise.all([
        this.client.connect(),
        this.subscriber.connect(),
        this.publisher.connect()
      ]);

      console.log('Redis connected successfully');
    } catch (error) {
      console.error('Redis connection error:', error);
      throw error;
    }
  }

  // User presence
  async setUserPresence(userId, status) {
    await this.client.hSet('user_presence', userId, JSON.stringify({
      status,
      lastSeen: Date.now()
    }));
  }

  async getUserPresence(userId) {
    const presence = await this.client.hGet('user_presence', userId);
    return presence ? JSON.parse(presence) : null;
  }

  // Room management
  async addUserToRoom(roomId, userId) {
    await this.client.sAdd(`room:${roomId}:users`, userId);
  }

  async removeUserFromRoom(roomId, userId) {
    await this.client.sRem(`room:${roomId}:users`, userId);
  }

  async getRoomUsers(roomId) {
    return await this.client.sMembers(`room:${roomId}:users`);
  }

  // Typing indicators
  async setTypingStatus(roomId, userId, isTyping) {
    if (isTyping) {
      await this.client.setEx(`typing:${roomId}:${userId}`, 5, '1');
    } else {
      await this.client.del(`typing:${roomId}:${userId}`);
    }
  }

  async getTypingUsers(roomId) {
    const pattern = `typing:${roomId}:*`;
    const keys = await this.client.keys(pattern);
    return keys.map(key => key.split(':')[2]);
  }

  // Rate limiting
  async checkRateLimit(userId, action, limit, window) {
    const key = `ratelimit:${action}:${userId}`;
    const count = await this.client.incr(key);
    
    if (count === 1) {
      await this.client.expire(key, window);
    }
    
    return count <= limit;
  }

  // Message caching
  async cacheMessage(roomId, message) {
    const key = `messages:${roomId}`;
    await this.client.lPush(key, JSON.stringify(message));
    await this.client.lTrim(key, 0, 99); // Keep last 100 messages
  }

  async getCachedMessages(roomId) {
    const key = `messages:${roomId}`;
    const messages = await this.client.lRange(key, 0, -1);
    return messages.map(msg => JSON.parse(msg));
  }

  // User sessions
  async storeUserSession(sessionId, userData) {
    await this.client.setEx(`session:${sessionId}`, 86400, JSON.stringify(userData)); // 24 hours
  }

  async getUserSession(sessionId) {
    const session = await this.client.get(`session:${sessionId}`);
    return session ? JSON.parse(session) : null;
  }

  // Room statistics
  async incrementRoomStats(roomId, stat) {
    const key = `stats:${roomId}`;
    await this.client.hIncrBy(key, stat, 1);
  }

  async getRoomStats(roomId) {
    return await this.client.hGetAll(`stats:${roomId}`);
  }

  // Cleanup
  async cleanup() {
    if (this.client) {
      await this.client.quit();
    }
    if (this.subscriber) {
      await this.subscriber.quit();
    }
    if (this.publisher) {
      await this.publisher.quit();
    }
  }
}

module.exports = new RedisService();
