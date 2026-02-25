import { describe, expect, it } from "vitest";
import { asMatrix, parseTable, selectData } from "./data-io.js";

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
    expect(() => asMatrix([[1, "a"]])).toThrow("Not an array");
    expect(() => asMatrix([1, "a"])).toThrow("Not an array");
  });

  it("throws if jagged", () => {
    expect(() => asMatrix([[1, 2], [3]])).toThrow("Jagged");
  });

  it("throws if Infinity or NaN", () => {
    expect(() => asMatrix([1, Number.NaN])).toThrow("Not an array");
    expect(() => asMatrix([1, Infinity])).toThrow("Not an array");
  });
});

describe("parseTable", () => {
  it("parses 2D JSON array", () => {
    expect(parseTable("[[1, 2], [3, 4]]")).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("parses JSON vector", () => {
    expect(parseTable("[1, 2, 3]")).toEqual([1, 2, 3]);
  });

  it("parses 2D CSV", () => {
    expect(parseTable("1,2\n3,4")).toEqual([
      [1, 2],
      [3, 4],
    ]);

    // Whitespaces allowed
    expect(parseTable("1, 2\n3, 4\n")).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("parses 1D row CSV", () => {
    expect(parseTable("1,2,3")).toEqual([[1, 2, 3]]);
  });

  it("parses 1D column CSV", () => {
    expect(parseTable("1\n2\n3")).toEqual([[1], [2], [3]]);
  });

  it("throws on leading whitespace", () => {
    expect(() => parseTable(" 1,2\n3,4")).toThrow("whitespace");
  });

  it("throws if row is empty", () => {
    expect(parseTable("1,2\n# comment\n3,4")).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(() => parseTable("1,2\n\n3,4")).toThrow("Empty line");
    // Leading \n: NG
    expect(() => parseTable("\n1,2\n")).toThrow("Empty line");
    // Trailing \n: OK
    expect(parseTable("1,2\n\n")).toEqual([[1, 2]]);
  });

  it("parses empty matrix", () => {
    expect(parseTable("")).toEqual([]);
    expect(parseTable("\n")).toEqual([]);
  });

  it("parses space-separated matrix", () => {
    expect(parseTable("1  2\n3  4")).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("throws if non-numerical", () => {
    expect(() => parseTable("1,2\n3,a")).toThrow("Failed to parse row");
  });

  it("ignores comments (whole line)", () => {
    expect(parseTable("# hogefuga\n1,2\n3,4")).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("ignores comments (partial)", () => {
    expect(parseTable("1,2 # hoge\n3,4 # fuga")).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("works with mixed line endings", () => {
    expect(parseTable("1\r\n2\n3")).toEqual([[1], [2], [3]]);
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
    expect(selectData(mat, { target: "row", index: -1 })).toEqual([3, 4]);
  });

  it("selects column from matrix", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    expect(selectData(mat, { target: "col", index: 0 })).toEqual([1, 3]);
    expect(selectData(mat, { target: "col", index: 1 })).toEqual([2, 4]);
    expect(selectData(mat, { target: "col", index: -1 })).toEqual([2, 4]);
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
    expect(() => selectData(mat, { target: "row", index: 12 })).toThrow(
      "Row index",
    );
    expect(() => selectData(mat, { target: "col", index: 9 })).toThrow(
      "Column index",
    );
  });
});
