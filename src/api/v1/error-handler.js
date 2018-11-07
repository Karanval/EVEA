import restifyErrors from 'express-server-error';

const errorsMap = {
  ReferenceError: 'InternalServerError',
  ValidationError: 'BadRequestError',
  ConfigurationError: 'BadRequestError',
  NotFoundError: 'NotFoundError'
};

export default (error) => {
  console.log(error); // eslint-disable-line

  let message;
  if (!error.messages) {
    message = error;
  } else {
    message = 'Error: ' + error.messages.join(' ');
  }
  return new restifyErrors[errorsMap[error.code] || 'BadRequestError'](message)
};
