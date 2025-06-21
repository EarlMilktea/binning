import { mean, stddev, variance } from "binning/stats.js";
import { describe, expect, it } from "vitest";

describe("mean", () => {
  it("empty", () => {
    expect(mean([])).toBe(0);
  });
  it("one element", () => {
    expect(mean([1])).toBeCloseTo(1);
  });
  it("others", () => {
    expect(mean([2, 3])).toBeCloseTo(2.5);
    expect(mean([1, 2, 3])).toBeCloseTo(2);
  });
});

describe("variance", () => {
  it("empty", () => {
    expect(variance([])).toBe(0);
  });
  it("one element", () => {
    expect(variance([1])).toBe(0);
  });
  it("others", () => {
    expect(variance([2, 3])).toBeCloseTo(0.5);
    expect(variance([1, 2, 3])).toBeCloseTo(1);
  });
});

describe("stddev", () => {
  it("empty", () => {
    expect(stddev([])).toBe(0);
  });
  it("one element", () => {
    expect(stddev([1])).toBe(0);
  });
  it("others", () => {
    expect(stddev([2, 3])).toBeCloseTo(Math.sqrt(0.5));
    expect(stddev([1, 2, 3])).toBeCloseTo(1);
  });
});
