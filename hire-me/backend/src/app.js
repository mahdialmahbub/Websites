import MongoStore from 'connect-mongo';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { env } from './config/env.js';
import { SESSION_COOKIE, sessionCookieOptions } from './lib/session.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { originGuard } from './middleware/originGuard.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import routes from './routes/index.js';

/** Call after the database is connected (the session store re-uses Mongoose's connection). */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  if (env.TRUST_PROXY > 0) app.set('trust proxy', env.TRUST_PROXY);

  app.use(helmet());
  app.use(
    cors({
      origin: env.allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      maxAge: 600,
    }),
  );
  app.use(morgan(env.isProd ? 'combined' : 'dev'));
  app.use(express.json({ limit: '200kb' }));

  app.use(
    session({
      name: SESSION_COOKIE,
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false, // no cookie for visitors who never log in
      rolling: true, //            activity extends the session
      store: MongoStore.create({
        clientPromise: Promise.resolve(mongoose.connection.getClient()),
        collectionName: 'sessions',
        ttl: Math.floor(env.sessionTtlMs / 1000),
        touchAfter: 24 * 60 * 60, // write the "last seen" time at most once a day
      }),
      cookie: { ...sessionCookieOptions, maxAge: env.sessionTtlMs },
    }),
  );

  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store'); // authenticated JSON must never be cached
    next();
  });
  app.use('/api', apiLimiter);
  app.use('/api', originGuard);
  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
