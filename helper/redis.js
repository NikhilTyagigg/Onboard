const redis = require('redis');
const config = require('config');
const util = require('util');

const redisConfig = config.get('redis');



const redisClient = redis.createClient({
  port: redisConfig.port,
  host: redisConfig.host,
  db: redisConfig.db,
  password: redisConfig.password
});

redisClient.auth(redisConfig.password)

exports.redisClient = redisClient;

exports.redisGetAsync   = util.promisify(redisClient.get.bind(redisClient));
exports.redisSetAsync   = util.promisify(redisClient.set.bind(redisClient));
exports.redisDelAsync   = util.promisify(redisClient.del.bind(redisClient));
exports.redisHSetAsync  = util.promisify(redisClient.hset.bind(redisClient));
exports.redisHGetAsync  = util.promisify(redisClient.hget.bind(redisClient));
exports.redisHDelAsync  = util.promisify(redisClient.hdel.bind(redisClient));
exports.redisLPushAsync = util.promisify(redisClient.lpush.bind(redisClient));
exports.redisLRemAsync  = util.promisify(redisClient.lrem.bind(redisClient));
exports.redisLLenAsync  = util.promisify(redisClient.llen.bind(redisClient));
exports.redisLPopAsync  = util.promisify(redisClient.lpop.bind(redisClient));
