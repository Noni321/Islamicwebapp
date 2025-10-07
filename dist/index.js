// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { z } from "zod";
var chatMessageSchema = z.object({
  message: z.string().min(1),
  conversationHistory: z.array(z.tuple([z.string(), z.string()])).optional()
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/chat", async (req, res) => {
    try {
      if (!req.is("application/json")) {
        return res.status(400).json({
          error: "Content-Type must be application/json",
          response: "Invalid request format."
        });
      }
      const body = chatMessageSchema.parse(req.body);
      const apiKey = process.env.MOSLEM_BOT_API_KEY;
      const userId = process.env.MOSLEM_BOT_USER_ID;
      if (!apiKey || !userId) {
        console.error("Missing required environment variables: MOSLEM_BOT_API_KEY or MOSLEM_BOT_USER_ID");
        return res.status(500).json({
          error: "Server configuration error",
          response: "The Islamic bot service is not properly configured. Please contact the administrator."
        });
      }
      const conversationHistoryString = body.conversationHistory && body.conversationHistory.length > 0 ? `[${body.conversationHistory.map(([q, a]) => `["${q.replace(/"/g, '\\"')}", "${a.replace(/"/g, '\\"')}"]`).join(", ")}]` : "[]";
      const requestBody = {
        data: [
          body.message,
          2048,
          0.7,
          0.95,
          conversationHistoryString
        ]
      };
      console.log("API Request Body:", JSON.stringify(requestBody, null, 2));
      const response = await fetch("https://api.moslembot.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
          "X-User-Id": userId
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error(`Moslem Bot API error (${response.status}):`, errorText);
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response Data:", JSON.stringify(data, null, 2));
      if (!data || !data.response || typeof data.response !== "string") {
        console.error("Invalid API response structure:", data);
        return res.status(500).json({
          error: "Invalid response from API",
          response: "I apologize, but I received an invalid response. Please try again."
        });
      }
      const chatResponse = {
        response: data.response
      };
      res.json(chatResponse);
    } catch (error) {
      console.error("Error calling Moslem Bot API:", error);
      res.status(500).json({
        error: "Failed to get response from Islamic bot",
        response: "I apologize, but there was an error processing your question. Please try again."
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "client/index.html")
    }
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json.bind(res);
  res.json = function(bodyJson) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    log(`Error ${status}: ${message}`);
  });
  if (!process.env.MOSLEM_BOT_API_KEY || !process.env.MOSLEM_BOT_USER_ID) {
    log("\n\u26A0\uFE0F  WARNING: Missing Moslem Bot API credentials!");
    log("Please set the following environment variables:");
    log("  - MOSLEM_BOT_API_KEY");
    log("  - MOSLEM_BOT_USER_ID");
    log("The chatbot will not work without these credentials.\n");
  }
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
