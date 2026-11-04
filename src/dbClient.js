var redis = require("redis");
const configure = require('./configure')

const config = configure()
const db = process.env.REDIS_URL
  ? redis.createClient({
      url: process.env.REDIS_URL
    })
  : redis.createClient({
      url: `redis://${config.redis.host}:${config.redis.port}`
    });

db.on("error", (err) => console.error("Redis error :", err));

if (typeof db.connect === 'function') {
  db.connect().catch(console.error);
}

process.on('SIGINT', function () {
  db.quit(() => {
      console.log("\nRedis disconnected. Server stopped.");
      process.exit(0);
    });
});

module.exports = db
