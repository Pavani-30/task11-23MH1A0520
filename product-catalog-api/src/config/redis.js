let redis;

if (process.env.NODE_ENV === "test") {
  // 🔥 In-memory Redis mock
  const store = {};

  redis = {
    async set(key, value, mode, ttl) {
      store[key] = value;
    },

    async get(key) {
      return store[key] || null;
    },

    async del(key) {
      delete store[key];
    },

    async keys(pattern) {
      const prefix = pattern.replace("*", "");
      return Object.keys(store).filter(key => key.startsWith(prefix));
    },

    async incr(key) {
      if (!store[key]) store[key] = 0;
      store[key]++;
      return store[key];
    },

    async expire() {
      // Ignore TTL in test mode
    }
  };

} else {
  const Redis = require("ioredis");

  redis = new Redis({
    host: process.env.REDIS_HOST || "redis",
    port: process.env.REDIS_PORT || 6379
  });
}

module.exports = redis;
