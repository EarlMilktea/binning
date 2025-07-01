/**
 * @file data-io.ts
 * @description IO utilities for binning CLI.
 */

/**
 * Validate and normalize numeric matrix.
 * @param obj Object to validate.
 * @returns Input data as a number matrix.
 */
export function asMatrix(obj: unknown): number[][] {
  if (!Array.isArray(obj)) {
    const msg = "Not an array";
    throw new TypeError(msg);
  }
  let arr: number[][];
  if (obj.every(Array.isArray)) {
    // Parse as 2D array
    if (!obj.every((row) => row.every((val) => typeof val === "number"))) {
      const msg = "Non-numeric values";
      throw new TypeError(msg);
    }
    arr = obj;
  } else {
    // Parse as 1D array
    if (!obj.every((val) => typeof val === "number")) {
      const msg = "Non-numeric values";
      throw new TypeError(msg);
    }
    arr = obj.map((val) => [val]);
  }
  const len = arr.at(0)?.length;
  if (len === undefined) {
    return arr;
  }
  for (const row of arr) {
    if (row.length !== len) {
      const msg = "Jagged array";
      throw new Error(msg);
    }
    for (const val of row) {
      if (Number.isNaN(val)) {
        const msg = "Found NaN";
        throw new Error(msg);
      }
      if (!Number.isFinite(val)) {
        const msg = "Found Infinity";
        throw new Error(msg);
      }
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
      line = line.replace(/\s+/g, ",");
    }
    try {
      ret.push(JSON.parse(`[${line}]`));
    } catch (e) {
      const msg = "Failed to parse row";
      throw new SyntaxError(msg, { cause: e });
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
  } catch (e) {
    console.assert(e instanceof SyntaxError, "Unexpected error: %s", e);
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
 * Extract a data sequence from a matrix.
 * @param data Input matrix.
 * @param op How to select data.
 * @returns Selected data sequence.
 */
export function selectData(data: readonly number[][], op?: Op): number[] {
  const rows = data.length;
  const cols = data.at(0)?.length;
  if (cols === undefined) {
    return [];
  }
  if (op === undefined) {
    if (rows === 1) {
      // 1D row vector
      return data[0];
    } else if (cols === 1) {
      return data.map((row) => row[0]);
    }
    const msg = "Cannot infer data sequence from matrix";
    throw new Error(msg);
  }
  let ret: number[];
  if (op.target === "row") {
    if (op.index < 0 || op.index >= rows) {
      const msg = `Row index out of bounds: ${op.index}`;
      throw new RangeError(msg);
    }
    ret = data[op.index];
  } else {
    if (op.index < 0 || op.index >= cols) {
      const msg = `Column index out of bounds: ${op.index}`;
      throw new RangeError(msg);
    }
    ret = data.map((row) => row[op.index]);
  }
  return ret;
}
