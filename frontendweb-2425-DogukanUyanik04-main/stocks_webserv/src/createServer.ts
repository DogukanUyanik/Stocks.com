import Koa from 'koa';
import dotenv from 'dotenv';
import config from 'config';

import { getLogger } from './core/logging';
import { initializeData, shutdownData } from './data';
import installMiddlewares from './core/installMiddlewares';
import installRest from './rest';
import type {
  KoaApplication,
  StockAppContext,
  StockAppState,
} from './types/koa'; 


dotenv.config();  // Add this line to load the environment variables

const PORT = config.get<number>('port');


export interface Server {
  getApp(): KoaApplication;
  start(): Promise<void>;
  stop(): Promise<void>;
}



export default async function createServer(): Promise<Server> {
  const app = new Koa<StockAppState, StockAppContext>();

  installMiddlewares(app);
  await initializeData();
  installRest(app);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise<void>((resolve) => {
        app.listen(PORT, () => {
          getLogger().info(`🚀 Server listening on http://localhost:${PORT}`);
          resolve();
        });
      });
    },

    async stop() {
      app.removeAllListeners();
      await shutdownData();
      getLogger().info('Goodbye! 👋');
    },
  };
}
