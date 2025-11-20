import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/error-handler.middleware';

export const createApp = (): Express => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use(routes);

  // Error handling
  app.use(errorHandler);

  return app;
};
