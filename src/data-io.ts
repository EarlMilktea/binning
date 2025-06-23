/**
 * Data IO for binning CLI.
 * @module data-io
 */

/**
 * Validates input as a number matrix.
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

function parseTable(input: string): unknown[] {
  input = input.trim();
  if (input.length === 0) {
    return [];
  }
  const ret: unknown[] = [];
  for (let line of input.split(/\r?\n/)) {
    line = line.trim();
    if (line.length === 0) {
      const msg = "Empty line";
      throw new Error(msg);
    }
    if (line.startsWith("#")) {
      // Skip comments
      continue;
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

function parse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch (e) {
    console.assert(e instanceof SyntaxError, "Unexpected error: %s", e);
  }
  if (input.includes("[") || input.includes("]")) {
    const msg = "Failed to parse as JSON";
    throw new SyntaxError(msg);
  }
  return parseTable(input);
}

/**
 * Parses a string into a number matrix.
 */
export function parseMatrix(input: string): number[][] {
  return asMatrix(parse(input));
}

/**
 * Extracts a data sequence from a matrix.
 */
export function selectData(
  data: number[][],
  op?: {
    target: "row" | "col";
    index: number;
  },
): number[] {
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
