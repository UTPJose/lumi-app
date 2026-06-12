import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";
import { handleTTS } from "./tts.ts";
import { handleGemini } from "./gemini.ts";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/server/health", (c) => {
  return c.json({ status: "ok" });
});

// Root health check
app.get("/server", (c) => {
  return c.json({ status: "ok", message: "server function is running" });
});

// Text-to-Speech endpoint
app.post("/server/tts", handleTTS);

// Gemini AI endpoint
app.post("/server/gemini", handleGemini);

Deno.serve(app.fetch);
