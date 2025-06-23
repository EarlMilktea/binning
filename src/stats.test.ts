import { describe, expect, it } from "vitest";
import { mean, stddev, variance } from "./stats.js";

describe("mean", () => {
  it("returns 0 if empty", () => {
    expect(mean([])).toBe(0);
  });

  it("returns mean otherwise", () => {
    expect(mean([1])).toBeCloseTo(1);
    expect(mean([2, 3])).toBeCloseTo(2.5);
    expect(mean([1, 2, 3])).toBeCloseTo(2);
  });
});

describe("variance", () => {
  it("returns 0 if empty", () => {
    expect(variance([])).toBe(0);
  });

  it("returns 0 if length-one", () => {
    expect(variance([1])).toBe(0);
  });

  it("returns var. (DoF=1) otherwise", () => {
    expect(variance([2, 3])).toBeCloseTo(0.5);
    expect(variance([1, 2, 3])).toBeCloseTo(1);
  });
});

describe("stddev", () => {
  it("returns 0 if empty", () => {
    expect(stddev([])).toBe(0);
  });

  it("returns 0 if length-one", () => {
    expect(stddev([1])).toBe(0);
  });

  it("returns stddev. (DoF=1) otherwise", () => {
    expect(stddev([2, 3])).toBeCloseTo(Math.sqrt(0.5));
    expect(stddev([1, 2, 3])).toBeCloseTo(1);
  });
});
