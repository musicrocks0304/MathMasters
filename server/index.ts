import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { promises as fs } from "fs";
import { createUserStorage } from "./storage.ts";
import { createViteProxy } from "./vite.js";
import routes from "./routes.ts";

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
  async (username: string, password: string, done: any) => {
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

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
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
  req.logout((err: any) => {
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

// Use additional routes
app.use("/api", routes);

if (isDev) {
  // Development mode with Vite
  try {
    await createViteProxy(app);
    console.log("[vite] proxy configured successfully");
  } catch (error) {
    console.error("[vite] proxy setup failed:", error);
    // Fallback to serving static files
    app.get("*", (req, res) => {
      res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Math Practice Pro</title>
</head>
<body>
    <div id="root">
        <h1>Math Practice Pro</h1>
        <p>Vite development server error. Please check console logs.</p>
        <p>Error: ${error.message}</p>
    </div>
</body>
</html>`);
    });
  }
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
app.use((err: any, req: any, res: any, next: any) => {
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