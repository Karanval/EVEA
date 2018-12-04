'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restifyErrors = require('restify-errors');

var _restifyErrors2 = _interopRequireDefault(_restifyErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const errorsMap = {
  ReferenceError: 'InternalServerError',
  ValidationError: 'BadRequestError',
  ConfigurationError: 'BadRequestError',
  NotFoundError: 'NotFoundError'
};

exports.default = error => {
  console.log(error); // eslint-disable-line

  let message;
  if (!error.messages) {
    message = error;
  } else {
    message = 'Error: ' + error.messages.join(' ');
  }
  return new _restifyErrors2.default[errorsMap[error.code] || 'BadRequestError'](message);
};