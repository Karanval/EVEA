import express from 'express';
import cors from 'cors';

export default function(serverConfig = {}) {

  const server = express();

  let corsOptions = {
    preflightMaxAge: 25,
    allowHeaders: ['*', 'Authorization'],
    exposeHeaders: ['*']
  };

  server.use(cors(corsOptions));

  const port = process.env.PORT || serverConfig.port || 8080;

  server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url); // eslint-disable-line
  });

  return server;
};
