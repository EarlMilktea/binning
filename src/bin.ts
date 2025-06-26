#!/usr/bin/env node
import { app, parseArgs } from "./cli.js";

const cfg = parseArgs();
void app(cfg);
