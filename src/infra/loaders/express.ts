import * as bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rTracer from 'cls-rtracer';

import {
  Application,
  Request,
  Response,
  HTTP_STATUS,
} from '../../common/types';
import config from '../../config/app';
import { routes } from '../../modules';
import logger from './logger';

export default ({ app }: { app: Application }) => {
  app.head('/status', (req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).end();
  });

  app.get('/', (req: Request, res: Response) => {
    res.json({ info: 'API' }).end();
  });

  app.get('/status', (req: Request, res: Response) => {
    res.json({ version: 'API v.1.0.5' }).end();
  });

  app.enable('trust proxy');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cors());
  app.use(compression());
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(rTracer.expressMiddleware());
  // init API routes
  app.use(config.api.prefix, routes());

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Requested resource not found');
    err['status'] = HTTP_STATUS.NOT_FOUND;
    next(err);
  });

  // error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .json({ error: `UnauthorizedError:${err.message}` })
        .end();
    }
    return next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    res.json({
      error: err.message,
    });
  });

  logger.info('express initialized');

  return app;
};
