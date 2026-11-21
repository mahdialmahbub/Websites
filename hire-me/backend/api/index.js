import { createApp } from '../src/app.js';
import { connectDB } from '../src/config/db.js';

let app;

export default async function handler(req, res) {
  if (!app) {
    await connectDB();   // DB connect hoye gele abar connect hobe na
    app = createApp();   // connect howar PORER createApp, karon session store mongoose connection use kore
  }
  return app(req, res);
}