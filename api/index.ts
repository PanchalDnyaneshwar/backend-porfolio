import type { INestApplication } from '@nestjs/common';
import express, { Request, Response } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createApp } from '../src/app.factory';

let cachedServer: express.Express | null = null;
/** Retained so the Nest application graph is not GC'd between invocations. */
let cachedNestApp: INestApplication | null = null;
let bootstrapPromise: Promise<express.Express> | null = null;

async function getServer() {
  if (cachedServer) {
    return cachedServer;
  }

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const server = express();
      const nestApp = await createApp(new ExpressAdapter(server));
      cachedNestApp = nestApp;
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
