import { app, parseArgs } from "./cli.js";

/* c8 ignore start */
if (process.argv[1] === __filename) {
  const cfg = parseArgs();
  app(cfg).catch(console.error);
}
/* c8 ignore stop */
