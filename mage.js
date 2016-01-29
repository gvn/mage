const Hapi = require(`hapi`);
const fs = require(`fs`);
const shell = require(`shelljs`);

const server = new Hapi.Server();
const config = JSON.parse(shell.cat(`env.json`));

server.connection({
  host: config.host,
  port: config.port
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

// GET /blob/{locale}/{id}
server.route({
  method: `GET`,
  path:`/blob/{locale}/{id}`,
  config: {
    cors: true
  },
  handler: function (request, reply) {
    fs.readFile(`./dest/${request.params.id}/${request.params.locale}.json`, `utf8`, (err, data) => {
      if (err) {
        fs.stat(`./source/${request.params.id}.json`, (err2) => {
          // If a blob doesn't exist, but it has a schema, return null
          if (err2) {
            return reply(`Error: Blob "${request.params.id}" not found.`).code(404);
          } else {
            console.log(`Empty database requested for blob "${request.params.id}".`);
            return reply(`null`).type(`text/json`);
          }
        });
      } else {
        console.log(`Sending blob: "${request.params.id}"`);
        var lastModifiedTime = fs.statSync(`./dest/${request.params.id}/${request.params.locale}.json`).mtime;

        return reply(data).type(`text/json`).header(`Last-Modified`, lastModifiedTime);
      }
    });
  }
});

// POST /blob/{locale}/{id}
server.route({
  method: `POST`,
  path: `/blob/{locale}/{id}`,
  config: {
    cors: true
  },
  handler: (request, reply) => {
    var success = true;
    var targetSchema = `./source/${request.params.id}.json`;
    var targetFile = `./dest/${request.params.id}/${request.params.locale}.json`;

    // Attempt to parse raw text as JSON
    if (request.headers[`content-type`] !== `application/json`) {
      try {
        JSON.parse(request.payload);
      } catch (err) {
        console.log(err);
        success = false;
      }
    }

    // Store JSON
    if (success) {
      if (shell.test(`-e`, targetSchema)) {
        if (!shell.test(`-e`, `./dest/${request.params.id}`)) {
          shell.mkdir(`./dest/${request.params.id}`);
        }

        console.log(`Storing blob: "${request.params.id}"`);
        JSON.stringify(request.payload).to(targetFile);
        return reply(`JSON stored.`);
      } else {
        return reply(`Error: Schema "${request.params.id}" doesn't exist!`).code(404);
      }
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
    fs.readFile(`./source/${request.params.id}.json`, `utf8`, (err, data) => {
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
