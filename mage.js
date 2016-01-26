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

  server.route([{
    method: `GET`,
    path: `/edit/_css/{param*}`,
    handler: {
      directory: {
        path: `editor/_css/`
      }
    }
  }, {
    method: `GET`,
    path: `/edit/_js/{param*}`,
    handler: {
      directory: {
        path: `editor/_js/`
      }
    }
  }, {
    method: `GET`,
    path: `/edit/{param*}`,
    handler: {
      file: {
        path: `editor/index.html`
      }
    }
  }]);
});

// GET /blob/{id}
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
        console.log(`Sending blob: "${request.params.id}"`);
        return reply(data).type(`text/json`);
      }
    });
  }
});

// POST /blob/{id}
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
              console.log(`Storing blob: "${request.params.id}"`);
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

// GET /schema/{id}
server.route({
  method: `GET`,
  path: `/schema/{id}`,
  config: {
    cors: true
  },
  handler: (request, reply) => {
    fs.readFile(`./source/${request.params.id}/schema.json`, `utf8`, (err, data) => {
      if (err) {
        return reply(`Error: Schema "${request.params.id}" not found.`).code(404);
      } else {
        return reply(data).type(`text/json`);
      }
    });
  }
});

// TODO
// POST /schema/{id}

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }

  console.log(`Server running at:`, server.info.uri);
});
