export function asMatrix(obj: unknown): number[][] {
  if (!Array.isArray(obj)) {
    const msg = "Not an array";
    throw new TypeError(msg);
  }
  let arr: number[][];
  if (obj.every(Array.isArray)) {
    // Parse as 2D array
    if (!obj.every((row) => row.every((val) => typeof val === "number"))) {
      const msg = "Non-numeric values (2D)";
      throw new TypeError(msg);
    }
    arr = obj;
  } else {
    // Parse as 1D array
    if (!obj.every((val) => typeof val === "number")) {
      const msg = "Non-numeric values (1D)";
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
      if (!Number.isFinite(val)) {
        const msg = "Infinity or NaN value";
        throw new Error(msg);
      }
    }
  }
  return arr;
}
