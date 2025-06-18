import { mean, stddev, variance } from "binning-api/stats.js";
import { expect, test } from "vitest";

test("mean", () => {
  expect(mean([])).toBe(0);
  expect(mean([1])).toBeCloseTo(1);
  expect(mean([1, 3])).toBeCloseTo(2);
});

test("variance", () => {
  expect(variance([])).toBe(0);
  expect(variance([1])).toBe(0);
  expect(variance([1, 3])).toBeCloseTo(2);
});

test("stddev", () => {
  expect(stddev([])).toBe(0);
  expect(stddev([1])).toBe(0);
  expect(stddev([1, 3])).toBeCloseTo(Math.sqrt(2));
});
