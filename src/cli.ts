/**
 * @file cli.ts
 * @description CLI entry point.
 */

import { ArgumentParser } from "argparse";
import fs from "node:fs";
import { buffer } from "node:stream/consumers";
import BinaryBinner from "./binner.js";
import { asMatrix, parseTable, selectData, type Op } from "./data-io.js";

interface Args {
  row?: number;
  col?: number;
  input?: string;
  output?: string;
}

interface Config {
  src?: string;
  dst?: string;
  op?: Op;
}

/**
 * @param args Command line arguments.
 * @returns JS object containing parsed arguments.
 */
export function parseArgs(args?: string[]): Config {
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
    metavar: "SRC",
  });
  parser.add_argument("-o", "--output", {
    type: "str",
    help: "output destination, defaults to stdout",
    metavar: "DST",
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const cfg: Args = parser.parse_args(args);

  const ret: Config = { src: cfg.input, dst: cfg.output };
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

/**
 * Read input from stream without being bothered by EAGAIN.
 * @param input Readable stream to read from.
 * @returns Promise that resolves to a string read from the stream.
 */
async function readAll(input: NodeJS.ReadableStream): Promise<string> {
  return (await buffer(input)).toString("utf-8");
}

/**
 * Binary entry point.
 * @param cfg Configuration object.
 */
export async function app(cfg: Config) {
  const { src, dst, op } = cfg;

  const stream = src !== undefined ? fs.createReadStream(src) : process.stdin;
  const input = await readAll(stream);
  const arr = asMatrix(parseTable(input));

  const binner = new BinaryBinner(selectData(arr, op));

  const payload = JSON.stringify(binner.stat(), null, 2);
  fs.writeFileSync(dst ?? process.stdout.fd, payload);
}
