/* global JSONEditor */
// TODO : Remove this global ^

JSONEditor.defaults.theme = `bootstrap3`;
JSONEditor.defaults.iconlib = `bootstrap3`;

var editor;

function loadJSON() {
  var request = new XMLHttpRequest();

  request.onload = (data) => {
    editor.setValue(JSON.parse(data.currentTarget.response));
  };

  request.onerror = () => {
    console.error(`loadJSON failed.`);
  };

  request.open(`GET`, `http://localhost:31319/blob`);
  request.send();
}

function loadSchema() {
  var request = new XMLHttpRequest();

  request.onload = (data) => {
    editor = new JSONEditor(document.getElementById(`editor`),{
      // Initialize the editor with a JSON schema
      schema: JSON.parse(data.currentTarget.response)
    });

    loadJSON();
  };

  request.onerror = () => {
    console.error(`loadSchema failed.`);
  };

  request.open(`GET`, `http://localhost:31319/schema`);
  request.send();
}

function saveJSON() {
  var pageJSON = editor.getValue();
  var request = new XMLHttpRequest();

  request.onload = function() {
    if (this.status === 200) {
      console.log(`Data Stored`);
    } else {
      console.error(`Persistence error: ${this.status}`);
    }
  };

  request.onerror = function() {
    console.error(`Request failed`);
  };

  request.open(`POST`, `http://localhost:31319/blob`);
  request.setRequestHeader(`Content-Type`, `application/json`);
  request.send(JSON.stringify(pageJSON));
  console.log(`asdfasdf`);
}

document.getElementById(`submit`).addEventListener(`click`, () => {
  saveJSON();
});

loadSchema();
