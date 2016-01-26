const Hapi = require(`hapi`);
const fs = require(`fs`);

// Create a server with a host and port
const server = new Hapi.Server();

server.connection({
  host: `localhost`,
  port: 31319
});

server.register(require(`inert`), (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: `GET`,
    path: `/edit/{param*}`,
    handler: {
      directory: {
        path: `editor`
      }
    }
  });
});

// Add the route
server.route({
  method: `GET`,
  path:`/blob`,
  config: {
    cors: true
  },
  handler: function (request, reply) {
    fs.readFile(`./blob.json`, `utf8`, (err, data) => {
      return reply(data).type(`text/json`);
    });
  }
});

server.route({
  method: `POST`,
  path: `/blob`,
  config: {
    cors: true
  },
  handler: (request, reply) => {
    var success = true;

    if (request.headers[`content-type`] !== `application/json`) {
      try {
        JSON.parse(request.payload);
      } catch (err) {
        console.log(err);
        success = false;
      }
    }

    if (success) {
      fs.writeFile(`./blob.json`, JSON.stringify(request.payload), (err) => {
        if (!err) {
          return reply(`JSON stored.`);
        } else {
          console.error(err);
        }
      });
    } else {
      return reply(`Request failed due to malformed JSON.`).code(400);
    }
  }
});

server.route({
  method: `GET`,
  path: `/schema`,
  config: {
    cors: true
  },
  handler: (request, reply) => {
    fs.readFile(`./schema.json`, `utf8`, (err, data) => {
      return reply(data).type(`text/json`);
    });
  }
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }

  console.log(`Server running at:`, server.info.uri);
});
