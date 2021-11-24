import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import { join, resolve as __dirname } from 'path';
import cors from 'cors';
import stationboardRouter from './routes/stationboard.js';
import authRouter from './routes/auth.js';
import locationsRouter from './routes/locations.js';
import connectionsRouter from './routes/connections.js';

import Logger from './lib/logger.js';

const logger = Logger('index');

const app = express();

logger.info(join(__dirname(), '../client/build'));

app.use(express.static(join(__dirname(), '../client/build')));
app.use('/connectRoute', express.static(join(__dirname(), '../client/build')));
app.use('/signin', express.static(join(__dirname(), '../client/build')));
app.use('/register', express.static(join(__dirname(), '../client/build')));

app.use(express.json());
app.use(cors());

app.use(morgan('dev', {
  skip: (req, res) => res.statusCode < 400,
}));

const accessLogStream = rfs.createStream('access.log', {
  interval: '1h',
  maxFiles: 3,
  path: join(__dirname(), '/log'),
});

app.use(morgan('combined', { stream: accessLogStream }));

app.listen(5000, () => logger.info('listening on 5000'));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Chuggington API',
      description: 'Descrition',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/locations', locationsRouter);
app.use('/connections', connectionsRouter);
app.use('/stationsboards', stationboardRouter);
app.use('/auth', authRouter);

app.use('*', (req, res) => {
  res.status(404).json({
    success: 'false',
    data: 'Page not found',
  });
});

export default app;
