import restify from 'restify';
import corsMiddleware from 'restify-cors-middleware';

export default function(serverConfig = {}) {

  const server = restify.createServer();

  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser());

  let corsOrigins = [
      'http://localhost:4200'
    ],
    corsAllowHeaders = ['*', 'Authorization'],
    corsExposeHeaders = ['*'];

  const cors = corsMiddleware({
    preflightMaxAge: 25,
    origins: corsOrigins,
    allowHeaders: corsAllowHeaders,
    exposeHeaders: corsExposeHeaders
  });

  server.pre(cors.preflight);
  server.use(cors.actual);

  const port = process.env.PORT || serverConfig.port || 8080;

  server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url); // eslint-disable-line
  });

  return server;
};
