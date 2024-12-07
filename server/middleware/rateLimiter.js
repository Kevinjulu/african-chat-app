const { RateLimiterRedis } = require('rate-limiter-flexible');
const redisService = require('../services/redis');

// General rate limiter for API endpoints
const apiLimiter = new RateLimiterRedis({
  storeClient: redisService.client,
  keyPrefix: 'ratelimit_api',
  points: 100, // Number of points
  duration: 60, // Per 60 seconds
});

// Stricter rate limiter for authentication attempts
const authLimiter = new RateLimiterRedis({
  storeClient: redisService.client,
  keyPrefix: 'ratelimit_auth',
  points: 5, // 5 attempts
  duration: 60 * 15, // Per 15 minutes
});

// Message rate limiter
const messageLimiter = new RateLimiterRedis({
  storeClient: redisService.client,
  keyPrefix: 'ratelimit_message',
  points: 30, // 30 messages
  duration: 60, // Per minute
});

// Room join rate limiter
const roomJoinLimiter = new RateLimiterRedis({
  storeClient: redisService.client,
  keyPrefix: 'ratelimit_room_join',
  points: 10, // 10 room joins
  duration: 60, // Per minute
});

const rateLimitMiddleware = async (req, res, next) => {
  try {
    await apiLimiter.consume(req.ip);
    next();
  } catch (error) {
    res.status(429).json({
      error: 'Too many requests. Please try again later.'
    });
  }
};

const authRateLimitMiddleware = async (req, res, next) => {
  try {
    await authLimiter.consume(req.ip);
    next();
  } catch (error) {
    res.status(429).json({
      error: 'Too many login attempts. Please try again in 15 minutes.'
    });
  }
};

const messageRateLimitMiddleware = async (socket, next) => {
  try {
    await messageLimiter.consume(socket.user._id.toString());
    next();
  } catch (error) {
    next(new Error('Message rate limit exceeded. Please slow down.'));
  }
};

const roomJoinRateLimitMiddleware = async (socket, next) => {
  try {
    await roomJoinLimiter.consume(socket.user._id.toString());
    next();
  } catch (error) {
    next(new Error('Room join rate limit exceeded. Please try again later.'));
  }
};

module.exports = {
  rateLimitMiddleware,
  authRateLimitMiddleware,
  messageRateLimitMiddleware,
  roomJoinRateLimitMiddleware
};
