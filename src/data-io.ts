/**
 * @file data-io.ts
 * @description IO utilities for binning CLI.
 */

import { Type, type Static } from "typebox";
import Value from "typebox/value";

const NumT = Type.Number({
  exclusiveMinimum: -Infinity,
  exclusiveMaximum: Infinity,
});
const NumVecT = Type.Array(NumT);
const NumMatT = Type.Array(NumVecT);

/**
 * Try to parse a 1D numeric array.
 * @param obj Object to validate.
 * @returns Parsed array or null.
 */
function parse1DArray(obj: unknown): number[][] | null {
  try {
    const arr = Value.Parse(NumVecT, obj);
    return arr.map((v) => [v]);
  } catch {
    return null;
  }
}

/**
 * Try to parse a 2D numeric array.
 * @param obj Object to validate.
 * @returns Parsed array or null.
 */
function parse2DArray(obj: unknown): number[][] | null {
  try {
    return Value.Parse(NumMatT, obj);
  } catch {
    return null;
  }
}

/**
 * Validate and normalize numeric matrix.
 * @param obj Object to validate.
 * @returns Input data as a number matrix.
 */
export function asMatrix(obj: unknown): Static<typeof NumMatT> {
  const arr = parse2DArray(obj) ?? parse1DArray(obj);
  if (arr === null) {
    const msg = "Not an array of finite numbers";
    throw new Error(msg);
  }
  const len = arr.at(0)?.length;
  for (const row of arr) {
    if (row.length !== len) {
      const msg = "Jagged array";
      throw new Error(msg);
    }
  }
  return arr;
}

/**
 * Interpret a string as a CSV-like table.
 * @param input Input string to parse.
 * @returns Parsed data.
 */
function parseTableText(input: string): unknown[] {
  input = input.trimEnd();
  if (input.length === 0) {
    return [];
  }
  const ret: unknown[] = [];
  for (let line of input.split(/\r?\n/)) {
    line = line.trimEnd();
    if (line.length === 0) {
      const msg = "Empty line";
      throw new Error(msg);
    }
    const m = line.match(/([^#]*)(#.*)?/);
    if (m !== null) {
      line = m[1].trimEnd();
      if (line.length === 0) {
        continue;
      }
    }
    if (line.match(/^\s/) !== null) {
      const msg = "Leading whitespace";
      throw new SyntaxError(msg);
    }
    if (!line.includes(",")) {
      line = line.replaceAll(/\s+/g, ",");
    }
    try {
      ret.push(JSON.parse(`[${line}]`));
    } catch (error) {
      const msg = "Failed to parse row";
      throw new SyntaxError(msg, { cause: error });
    }
  }
  return ret;
}

/**
 * Interpret a string as a JSON or CSV-like table.
 * @param input Input string to parse.
 * @returns Parsed data.
 */
export function parseTable(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch (error) {
    console.assert(error instanceof SyntaxError, "Unexpected error: %s", error);
  }
  if (input.includes("[") || input.includes("]")) {
    const msg = "Failed to parse as JSON";
    throw new SyntaxError(msg);
  }
  return parseTableText(input);
}

export interface Op {
  readonly target: "row" | "col";
  readonly index: number;
}

/**
 * Extract a data row from a matrix.
 * @param data Input matrix.
 * @param index Row index.
 * @returns Selected data row.
 */
function selectDataRow(
  data: readonly (readonly number[])[],
  index: number,
): readonly number[] {
  const row = data.at(index);
  if (row === undefined) {
    const msg = `Row index out of bounds: ${index}`;
    throw new RangeError(msg);
  }
  return row;
}

/**
 * Extract a data column from a matrix.
 * @param data Input matrix.
 * @param index Column index.
 * @returns Selected data column.
 */
function selectDataCol(
  data: readonly (readonly number[])[],
  index: number,
): readonly number[] {
  return data.map((row) => {
    const val = row.at(index);
    if (val === undefined) {
      const msg = `Column index out of bounds: ${index}`;
      throw new RangeError(msg);
    }
    return val;
  });
}

/**
 * Extract a data sequence from a matrix.
 * @param data Input matrix.
 * @param op How to select data.
 * @returns Selected data sequence.
 */
export function selectData(
  data: readonly (readonly number[])[],
  op?: Op,
): readonly number[] {
  const rows = data.length;
  const cols = data.at(0)?.length;
  if (cols === undefined) {
    return [];
  }
  if (op === undefined) {
    if (rows === 1) {
      // 1D row vector
      op = { target: "row", index: 0 };
    } else if (cols === 1) {
      // 1D column vector
      op = { target: "col", index: 0 };
    } else {
      const msg = "Cannot infer data sequence from matrix";
      throw new Error(msg);
    }
  }
  return op.target === "row"
    ? selectDataRow(data, op.index)
    : selectDataCol(data, op.index);
}
