const redis = require('haredis');
const nodes = require('./config').redis;
const client = redis.createClient(nodes);

// exporing promises-based client of redis.
module.exports = {
  get: (key) =>
    new Promise(
      (res, rej) =>
        client.GET(
          key,
          (err, result) => err ? rej(err) : res(result)
        )
    ),

  set: (key, val) =>
    new Promise(
      (res, rej) =>
        client.SET(
          key,
          val,
          (err, result) => err ? rej(err) : res(result)
        )
    ),
};
