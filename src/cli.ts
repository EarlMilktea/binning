/**
 * @file cli.ts
 * @description CLI entry point.
 */

import { ArgumentParser } from "argparse";
import type { PathOrFileDescriptor } from "node:fs";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import BinaryBinner from "./binner.js";
import { binnerStat, parseMatrix, selectData, type Op } from "./data-io.js";

interface Args {
  row?: number;
  col?: number;
  input?: string;
  output?: string;
}

interface Config {
  src: PathOrFileDescriptor;
  dst: PathOrFileDescriptor;
  op?: Op;
}

export function parseArgs(args?: string[]) {
  const parser = new ArgumentParser({
    prog: "binning",
    description: "Correlated data analyzer written in TypeScript",
    add_help: true,
  });

  parser.add_argument("-r", "--row", {
    type: "int",
    help: "0-based row index to analyze, inferred if not specified",
  });
  parser.add_argument("-c", "--col", {
    type: "int",
    help: "0-based column index to analyze, inferred if not specified",
  });
  parser.add_argument("-i", "--input", {
    type: "str",
    help: "input source, defaults to stdin",
  });
  parser.add_argument("-o", "--output", {
    type: "str",
    help: "output destination, defaults to stdout",
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const cfg: Args = parser.parse_args(args);

  const src = cfg.input ?? process.stdin.fd;
  const dst = cfg.output ?? process.stdout.fd;
  const ret: Config = { src, dst };

  if (cfg.row !== undefined && cfg.col !== undefined) {
    const msg = "--row and --col cannot be specified at the same time";
    throw new Error(msg);
  }
  if (cfg.row !== undefined) {
    ret.op = { target: "row", index: cfg.row };
  }
  if (cfg.col !== undefined) {
    ret.op = { target: "col", index: cfg.col };
  }

  return ret;
}

export function app(cfg: Config) {
  const { src, dst, op } = cfg;

  const input = fs.readFileSync(src, { encoding: "utf-8" });
  const arr = parseMatrix(input);

  const binner = new BinaryBinner(selectData(arr, op));

  const payload = JSON.stringify(binnerStat(binner), null, 2);
  fs.writeFileSync(dst, payload);
}

/* c8 ignore start */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cfg = parseArgs();
  app(cfg);
}
/* c8 ignore stop */
