const redis = require("../config/redis");

exports.set = async (key, value, ttl) => {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
};

exports.get = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

exports.del = async (key) => {
  await redis.del(key);
};
