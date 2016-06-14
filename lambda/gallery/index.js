"use strict";

var gallery = require("./gallery.js");

exports.handler = function(event, context) {
  console.log("handler invoked", event);
  gallery[event.function](event, context);
};

