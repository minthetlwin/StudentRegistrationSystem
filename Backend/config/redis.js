import Redis from "ioredis";

let redis;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,

    retryStrategy(times) {
      const delay = Math.min(times * 500, 2000);
      console.log(`Redis retry #${times}, waiting ${delay}ms...`);
      return delay;
    },
  });

  redis.on("connect", () => {
    console.log(" Redis connected successfully");
  });

  redis.on("error", (err) => {
    console.error(" Redis error:", err.message);
  });

} catch (err) {
  console.log(" Redis initialization failed:", err.message);
  redis = null;
}

export default redis;
