import express, { Request, Response } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createApp } from '../src/app.factory';

let cachedServer: express.Express | null = null;
let bootstrapPromise: Promise<express.Express> | null = null;

async function getServer() {
  if (cachedServer) {
    return cachedServer;
  }

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const server = express();
      await createApp(new ExpressAdapter(server));

      cachedServer = server;
      return server;
    })();
  }

  return bootstrapPromise;
}

export default async function handler(req: Request, res: Response) {
  const server = await getServer();
  return server(req, res);
}
