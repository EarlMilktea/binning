import { ArgumentParser } from "argparse";
import * as fs from "node:fs";
import BinaryBinner from "./binner.js";
import { binnerStat, parseMatrix, selectData } from "./data-io.js";

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

interface Args {
  row?: number;
  col?: number;
  input?: string;
  output?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const args: Args = parser.parse_args();

let src: string | number;
if (args.input !== undefined) {
  src = args.input;
} else {
  src = process.stdin.fd;
}

const input = fs.readFileSync(src, "utf-8");
const arr = parseMatrix(input);

let op: { target: "row" | "col"; index: number } | undefined;
if (args.row !== undefined && args.col !== undefined) {
  const msg = "--row and --col cannot be specified at the same time";
  throw new Error(msg);
}
if (args.row !== undefined) {
  op = { target: "row", index: args.row };
} else if (args.col !== undefined) {
  op = { target: "col", index: args.col };
}

const data = selectData(arr, op);

const binner = new BinaryBinner(data);

let dst: string | number;
if (args.output !== undefined) {
  dst = args.output;
} else {
  dst = process.stdout.fd;
}

const output = JSON.stringify(binnerStat(binner), null, 2);
fs.writeFileSync(dst, output, "utf-8");
