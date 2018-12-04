import config from './config';

import createCore from './create_core';
import createServer from './server';
import api from './api';

const port = process.env.PORT || 3000;
console.log("env: "+process.env.NODE_ENV);
let server = createServer(config.server);
let core = createCore(config.database);

api(server, core);