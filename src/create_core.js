import Core from './core';

export default (config = {}) => {

  const core = new Core(config);

  core.on('message', function(message) {
    console.log(`New message from core: ${message}`); // eslint-disable-line
  });

  core.start();

  return core;
};
