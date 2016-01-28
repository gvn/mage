/* global JSONEditor */
// TODO : Remove this global ^

var config = JSON.parse(document.querySelector(`script[type="text/json"`).innerText);

JSONEditor.defaults.theme = `bootstrap3`;
JSONEditor.defaults.iconlib = `bootstrap3`;

var editor;
var blob = window.location.pathname.match(/\/edit\/([a-zA-Z\d-_]*)/)[1];
var elLocaleSelect = document.querySelector(`select`);


function loadJSON(locale) {
  var request = new XMLHttpRequest();

  request.onload = (data) => {
    editor.setValue(JSON.parse(data.currentTarget.response));
  };

  request.onerror = () => {
    console.error(`loadJSON failed.`);
  };

  request.open(`GET`, `http://localhost:31319/blob/${locale}/${blob}`);
  request.send();
}

function loadSchema(callback) {
  var request = new XMLHttpRequest();

  request.onload = (data) => {
    editor = new JSONEditor(document.getElementById(`editor`),{
      // Initialize the editor with a JSON schema
      schema: JSON.parse(data.currentTarget.response)
    });

    callback.call();
  };

  request.onerror = () => {
    console.error(`loadSchema failed.`);
  };

  request.open(`GET`, `http://localhost:31319/schema/${blob}`);
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

  request.open(`POST`, `http://localhost:31319/blob/${elLocaleSelect.value}/${blob}`);
  request.setRequestHeader(`Content-Type`, `application/json`);
  request.send(JSON.stringify(pageJSON));
  console.log(`asdfasdf`);
}

// Event Delegation

elLocaleSelect.addEventListener(`change`, () => {
  loadJSON(elLocaleSelect.value);
});

document.getElementById(`submit`).addEventListener(`click`, () => {
  saveJSON();
});

// Initialize

loadSchema(() => {
  loadJSON(config.defaultLocale);
});
