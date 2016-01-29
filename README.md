<img src="http://gvn.github.io/mage/assets/mage.png" width="200"><br/>

**A RESTful, localizable, JSON-oriented CMS**

## About

Mage is a *pure* CMS. Unlike most CMSes, Mage is unopinionated about how you build your front end. It provides JSON via a REST API and an interface to edit content. That's all it does!

Mage functions similarly to a [static site generator](https://github.com/skx/static-site-generators). It works by managing a collection of "blobs", which are simply JSON documents. It's up to you to define the structure of your blobs through [JSON schemas](http://json-schema.org/).

### Design Principles

- Lightweight and front-end agnostic.
- Schema-bound document storage.
- Localization is a first class citizen.
- Client and server-side validation comes free.

## Setup

Mage requires an installation of [Node and npm](https://nodejs.org/en/) to operate.

Run the following commands in your terminal:

1. `git clone https://github.com/gvn/mage.git && cd mage`
2. `npm install`
3. `cp env.json.sample env.json`
4. `npm start`

## Blobs

### Adding a blob

1. Add a new JSON schema in `/source` named after your blob (eg: `pizza.json`).

**Pro Tip –** Use the generator at [jsonschema.net](http://jsonschema.net) to create a schema!

### Editing a blob

To edit a blob's content, just navigate to [http://localhost:31319/edit/BLOB](http://localhost:31319/edit/BLOB) and use the form.

When you're done, just hit the **Save** button. That's it!

### Adding locales

By default, Mage is limited to a single locale, US English, but it's easy to add more! Just add additional locales to your `env.json`'s `locales` array as needed. Once there are multiple locales defined, you will see a dropdown menu in the editor to switch between them.

## REST API

### `/blob/LOCALE/ID`

- `GET` : Retrieve JSON for the specified ID and LOCALE.
- `PUT` : Store JSON for the specified ID and LOCALE.

### `/blobs`

- `GET` : Retrieve a list of the available blobs as well as their modification dates where applicable.

### `/schema/ID`

- `GET` : Retrieve the JSON Schema for the specified ID.
