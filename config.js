const localHost = '192.168.99.100';
module.exports = {
  redis: process.env.NODE_ENV === 'production'
    ?  ['redis1', 'redis2', 'redis3', 'redis4', 'redis5']
    :  [localHost + ':63791', localHost + ':63792', localHost + ':63793', localHost + ':63794', localHost + ':63795' ],

  mongo: process.env.NODE_ENV === 'production'
    ? ['mongo1', 'mongo2', 'mongo3', 'mongo4', 'mongo5']
    : [localHost + ':27011', localHost + ':27012', localHost + ':27013', localHost + ':27014', localHost + ':27045' ],
};
