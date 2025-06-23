import { describe, expect, it } from "vitest";
import { asMatrix } from "./data-io.js";

describe("asMatrix", () => {
  it("returns matrix as-is", () => {
    let mat: number[][];

    mat = [
      [1, 2],
      [3, 4],
    ];
    expect(asMatrix(mat)).toEqual(mat);

    mat = [[1, 2, 3]];
    expect(asMatrix(mat)).toEqual(mat);

    mat = [[1], [2], [3]];
    expect(asMatrix(mat)).toEqual(mat);

    mat = [];
    expect(asMatrix(mat)).toEqual(mat);
  });

  it("treats vector as column", () => {
    expect(asMatrix([1, 2, 3])).toEqual([[1], [2], [3]]);
  });

  it("throws if not an array", () => {
    expect(() => asMatrix(1)).toThrow("Not an array");
    expect(() => asMatrix("foo")).toThrow("Not an array");
    expect(() => asMatrix({})).toThrow("Not an array");
  });

  it("throws if non-numerical", () => {
    expect(() => asMatrix([[1, "a"]])).toThrow("Non-numeric");
    expect(() => asMatrix([1, "a"])).toThrow("Non-numeric");
  });

  it("throws if jagged", () => {
    expect(() => asMatrix([[1, 2], [3]])).toThrow("Jagged");
  });

  it("throws if Infinity or NaN", () => {
    expect(() => asMatrix([1, Infinity])).toThrow("Infinity or NaN");
    expect(() => asMatrix([1, NaN])).toThrow("Infinity or NaN");
  });
});
