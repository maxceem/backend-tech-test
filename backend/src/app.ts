import express, { Express } from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { createRoutes } from './routes';
import { errorHandler } from './middleware/error-handler.middleware';

export const createApp = (dataSource: DataSource): Express => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use(createRoutes(dataSource));

  // Error handling
  app.use(errorHandler);

  return app;
};
