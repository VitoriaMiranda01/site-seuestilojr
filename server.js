/**
 * Custom entry point for hosts that require a plain Node.js "startup file"
 * (Passenger-style Node.js app hosting, e.g. Hostinger's hPanel Node.js
 * feature) instead of running an npm script like `next start`.
 *
 * Run `npm run build` once before starting this (it serves the production
 * build from .next/, it does not build on the fly).
 */
const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, hostname, () => {
    console.log(`> Servidor pronto em http://${hostname}:${port}`);
  });
});
