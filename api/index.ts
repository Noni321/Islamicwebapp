import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;

async function initializeApp() {
  if (!initialized) {
    const server = createServer(app);
    await registerRoutes(server);
    
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
    
    initialized = true;
  }
}

export default async function handler(req: any, res: any) {
  await initializeApp();
  return app(req, res);
}
