import { app, parseArgs } from "./cli.js";

const cfg = parseArgs();
await app(cfg);
