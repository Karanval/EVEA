'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  copyObject: function copyObject(obj) {
    return Object.assign({}, obj);
  },
  stringifyId: function stringifyId(id) {
    if (typeof id === 'object') {
      let identifier = '';

      Object.keys(id).forEach(key => {
        identifier = `${identifier} ${key}=${id[key]}`;
      });

      return identifier.trim();
    }

    return id;
  }
};