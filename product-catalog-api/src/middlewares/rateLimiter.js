const redis = require("../config/redis");

const WINDOW_SIZE = 60; // seconds
const MAX_REQUESTS = 100;

module.exports = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rate_limit:${ip}`;

    const requests = await redis.incr(key);

    if (requests === 1) {
      await redis.expire(key, WINDOW_SIZE);
    }

    if (requests > MAX_REQUESTS) {
      return res.status(429).json({
        message: "Too many requests"
      });
    }

    next();

  } catch (error) {
    console.error("Rate limit error:", error);
    next();
  }
};
