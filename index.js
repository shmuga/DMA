'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const redis = require('./redis');
const mongo = require('./mongo');
const fib = require('./fib');

const server = new Hapi.Server();
server.connection({ port: 3000 });
server.register(Inert, () => {});

server.route({
  method: 'GET',
  path: '/',
  handler: {
    file: './index.html'
  }
})

server.route({
  method: 'GET',
  path: '/{number}',
  handler: (request, reply) => {
    let ab = null;
    mongo.get()
      .then(settings => {
        ab = settings;
        console.log(ab.a.toString() + ab.b.toString() + request.params.number.toString())
        return settings.a.toString() + settings.b.toString();
      })
      .then(settingsCache => redis.get(settingsCache + request.params.number.toString()))
      .then(cache => {
        if (cache) {
          return cache;
        } else {
          const f = fib(request.params.number) * ab.a + ab.b;
          console.log(ab.a.toString() + ab.b.toString() + request.params.number.toString())
          return redis.set(ab.a.toString() + ab.b.toString() + request.params.number.toString(), f)
            .then((result) => f);
        }
      })
      .then((formula) => reply(formula))
      .catch((err) => reply(err.stack));
  }
});

server.route({
  method: 'GET',
  path: '/settings',
  handler: (request, reply) => {
    mongo.get()
      .then(
        (res) => reply(res), 
        (err) => {
          console.log(err);
          reply(err);
        }
      );
  }
});

server.route({
  method: 'POST',
  path: '/settings',
  handler: (request, reply) => {
    console.log(request.payload);
    mongo.set(request.payload.id, request.payload.a, request.payload.b)
      .then(res => reply(res), err => reply(err))
      .catch((err) => reply(err));
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
