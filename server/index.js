import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { createProxyMiddleware } from "http-proxy-middleware";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { promises as fs } from "fs";
import { createUserStorage } from "./storage.js";
// Vite proxy will be handled differently in JS
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = parseInt(process.env.PORT || "5000", 10);
const isDev = process.env.NODE_ENV === "development";

const app = express();
const httpServer = createServer(app);

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "dev-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Initialize storage
const userStorage = createUserStorage();

// Passport configuration
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await userStorage.findByUsername(username);
      if (user && user.password === password) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userStorage.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// API routes
app.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.json({ success: true, user: req.user });
});

app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ success: true });
  });
});

app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

if (isDev) {
  // Development mode with Vite proxy
  const { createProxyMiddleware } = await import("http-proxy-middleware");

  app.use("/", createProxyMiddleware({
    target: "http://localhost:24678",
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      "^/api": "/api", // Keep API routes
    },
    router: (req) => {
      if (req.path.startsWith("/api")) {
        return false; // Don't proxy API routes
      }
      return "http://localhost:24678";
    },
  }));

  console.log("[vite] proxy configured successfully");
} else {
  // Production mode
  const staticPath = join(__dirname, "../dist/public");

  try {
    await fs.access(staticPath);
    app.use(express.static(staticPath));

    app.get("*", (req, res) => {
      res.sendFile(join(staticPath, "index.html"));
    });
  } catch (error) {
    console.warn("Static files not found, serving basic response");
    app.get("*", (req, res) => {
      res.send("App not built. Run 'npm run build' first.");
    });
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// WebSocket setup
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());
    // Echo back for now
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`[express] serving on port ${PORT}`);
});