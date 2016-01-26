const Hapi = require(`hapi`);
const fs = require(`fs`);

const server = new Hapi.Server();

server.connection({
  host: `localhost`,
  port: 31319
});

// Serve static frontend:
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

server.route({
  method: `GET`,
  path:`/blob/{id}`,
  config: {
    cors: true
  },
  handler: function (request, reply) {
    fs.readFile(`./dest/${request.params.id}/blob.json`, `utf8`, (err, data) => {
      if (err) {
        return reply(`Error: Blob "${request.params.id}" not found.`).code(404);
      } else {
        return reply(data).type(`text/json`);
      }
    });
  }
});

server.route({
  method: `POST`,
  path: `/blob/{id}`,
  config: {
    cors: true
  },
  handler: (request, reply) => {
    var success = true;
    var targetFile = `./dest/${request.params.id}/blob.json`;

    if (request.headers[`content-type`] !== `application/json`) {
      try {
        JSON.parse(request.payload);
      } catch (err) {
        console.log(err);
        success = false;
      }
    }

    if (success) {
      fs.stat(targetFile, (err) => {
        if (!err) {
          fs.writeFile(targetFile, JSON.stringify(request.payload), (err2) => {
            if (!err2) {
              return reply(`JSON stored.`);
            }
          });
        } else {
          return reply(`Error: Target blob "${request.params.id}" doesn't exist!`).code(404);
        }
      });
    } else {
      return reply(`Error: Request failed due to malformed JSON.`).code(400);
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
