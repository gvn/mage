# Mage

**A [JSON Schema](http://json-schema.org/)-based CMS generator prototype**

## About

Mage is a CMS for people who *hate* CMSes. Similar to a static site generator, it can be thought of as a *static CMS generator*. It shines when you need to create a simple JSON based REST API for structured documents, or *blobs*.

Mage works by managing a collection of "blobs", which are simply JSON documents. It's up to you to define the structure of your blobs through JSON schemas.

## Design Principles

- Schema-first
- Localization is a first class citizen
- Consumer agnostic
- Client and server-side validation comes free

## Setup

Mage requires an installation of [Node and npm](https://nodejs.org/en/) to operate.

Run the following commands in your terminal:

1. `git clone https://github.com/gvn/mage.git && cd mage`
2. `npm install`
3. `cp env.json.sample env.json`
4. `npm start`

## Adding a blob

1. Create a new folder in `/source` with the name of your blob.
2. Add a JSON Schema for your blob to the folder and name it `schema.json`. Pro tip: Use the generator at [jsonschema.net](http://jsonschema.net)!

## Editing a blob

To edit a blob's content, just navigate to [http://localhost:31319/edit/BLOB](http://localhost:31319/edit/BLOB) and use the form.

When you're done, just hit the Save button. That's it!

## REST API

### `/blob/LOCALE/ID`

- `GET` : Retrieve JSON for the specified ID and LOCALE.
- `PUT` : Store JSON for the specified ID and LOCALE.

### `/schema/ID`

- `GET` : Retrieve the JSON Schema for the specified ID.
