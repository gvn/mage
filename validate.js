"use strict";

const shell = require(`shelljs`);
const Ajv = require(`ajv`);

let ajv = Ajv({
  allErrors: true,
  verbose: true
});

shell.config.silent = true;

function doValidation(target, schema) {
  schema = JSON.parse(schema);

  if (!ajv.validateSchema(schema)) {
    console.error(`Invalid schema: ${schema}`);
    shell.exit(2);
  }

  if (!ajv.validate(schema, JSON.parse(target))) {
    return ajv.errors;
  } else {
    return null;
  }
}

let schemas = shell.ls(`./source`).map((schema) => {
  return {
    schema: shell.cat(`source/${schema}`),
    identifier: schema.split(`.`)[0]
  };
});

schemas.forEach((schema) => {
  let definition = schema.schema;

  let blobs = shell.ls(`dest/${schema.identifier}/*.json`);

  if (blobs.length) {
    blobs.forEach((blob) => {
      let errors = doValidation(shell.cat(blob), definition);

      if (errors) {
        console.log(`Invalid blob found: ${blob}\n`);
        console.error(errors);
        shell.exit(1);
      } else {
        console.log(`Validated: ${blob}`);
      }
    });
  }
});
