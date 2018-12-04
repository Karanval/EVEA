"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  toJSON: function toJSON() {
    let object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    object = object.toJSON ? object.toJSON() : object;

    return object;
  }
};