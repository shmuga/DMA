const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const settings = {
  replSet: {
    rs_name: 'rs'
  }
};
const server = require('./config').mongo;
const mongo = MongoClient.connect.bind(null, 'mongodb://' + server.join(',') + '/mydb', settings);

const get = () => new Promise((res, rej) => {
  mongo((err, db) => {
    if (err) {
      rej(err);
      return;
    }
    db.collection('settings').findOne({}, (err, result) => {
      if (err) {
        rej(err);
        return;
      }
      db.close();
      res(result);
    });
  });
});

const set = (id, a, b) => new Promise((res, rej) => {
  mongo((err, db) => {
    if (err) {
      rej(err);
      return;
    }
    db.collection('settings').update(
    { _id: ObjectID(id) },
    { a, b },
    {upsert: true}, (err, result) => {
      if (err) {
        rej(err);
        return;
      }
      db.close();
      res(result);
    });
  });
});

module.exports = {
  get,
  set
};

