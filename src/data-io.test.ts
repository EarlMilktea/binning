import { describe, expect, it } from "vitest";
import { asMatrix, parseMatrix, selectData } from "./data-io.js";

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
    expect(() => asMatrix([1, NaN])).toThrow("NaN");
    expect(() => asMatrix([1, Infinity])).toThrow("Infinity");
  });
});

describe("parseMatrix", () => {
  it("parses 2D JSON array", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    expect(parseMatrix(JSON.stringify(mat))).toEqual(mat);
  });

  it("parses JSON vector", () => {
    expect(parseMatrix(JSON.stringify([1, 2, 3]))).toEqual([[1], [2], [3]]);
  });

  it("parses 2D CSV", () => {
    let csv: string;

    csv = "1,2\n3,4";
    expect(parseMatrix(csv)).toEqual([
      [1, 2],
      [3, 4],
    ]);

    // Whitespaces allowed
    csv = "1, 2\n3, 4\n";
    expect(parseMatrix(csv)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("parses 1D row CSV", () => {
    const csv = "1,2,3";
    expect(parseMatrix(csv)).toEqual([[1, 2, 3]]);
  });

  it("parses 1D column CSV", () => {
    const csv = "1\n2\n3";
    expect(parseMatrix(csv)).toEqual([[1], [2], [3]]);
  });

  it("throws if row is empty", () => {
    expect(() => parseMatrix("1,2\n\n3,4")).toThrow("Empty line");
    expect(parseMatrix("1,2\n\n")).toEqual([[1, 2]]);
  });

  it("parses empty matrix", () => {
    expect(parseMatrix("")).toEqual([]);
    expect(parseMatrix("\n")).toEqual([]);
  });

  it("parses space-separated matrix", () => {
    const csv = "1  2\n3  4";
    expect(parseMatrix(csv)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("throws if non-numerical", () => {
    expect(() => parseMatrix("1,2\n3,a")).toThrow("Failed to parse row");
  });

  it("ignores comments", () => {
    expect(parseMatrix("# hogefuga\n1,2\n3,4")).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("does not proceed to table mode if JSON-like", () => {
    expect(() => parseMatrix("[/]")).toThrow("Failed to parse as JSON");
  });
});

describe("selectData", () => {
  it("selects row from matrix", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    expect(selectData(mat, { target: "row", index: 0 })).toEqual([1, 2]);
    expect(selectData(mat, { target: "row", index: 1 })).toEqual([3, 4]);
  });

  it("selects column from matrix", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    expect(selectData(mat, { target: "col", index: 0 })).toEqual([1, 3]);
    expect(selectData(mat, { target: "col", index: 1 })).toEqual([2, 4]);
  });

  it("cannot infer data if not essentially 1D", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    expect(() => selectData(mat)).toThrow("infer");
  });

  it("selects 1D row vector", () => {
    const mat = [[1, 2, 3]];
    expect(selectData(mat)).toEqual([1, 2, 3]);
  });

  it("selects 1D column vector", () => {
    const mat = [[1], [2], [3]];
    expect(selectData(mat)).toEqual([1, 2, 3]);
  });

  it("selects empty matrix", () => {
    expect(selectData([])).toEqual([]);
  });

  it("throws if out of bounds", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    expect(() => selectData(mat, { target: "row", index: -1 })).toThrow(
      "Row index",
    );
    expect(() => selectData(mat, { target: "col", index: 9 })).toThrow(
      "Column index",
    );
  });
});
