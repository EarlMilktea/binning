import { describe, expect, it } from "vitest";
import BinaryBinner from "./binner.js";

describe("BinaryBinner", () => {
  it("binSize", () => {
    expect(() => BinaryBinner.binSize(-1)).toThrow("non-negative");
    expect(BinaryBinner.binSize(0)).toBe(1);
    expect(BinaryBinner.binSize(1)).toBe(2);
    expect(BinaryBinner.binSize(2)).toBe(4);
  });

  it("empty", () => {
    expect(() => new BinaryBinner([])).toThrow("empty");
  });

  it("single", () => {
    const obj = new BinaryBinner([1]);
    expect(obj.numLayers).toBe(1);
    expect(obj.layer(0)[0]).toBeCloseTo(1);
    expect(() => obj.layer(-2)).toThrow("out of bounds");
    expect(obj.numBins(0)).toBe(1);
    expect(obj.numSamples).toBe(1);
    expect(obj.mean).toBeCloseTo(1);
    expect(obj.rawVariance()).toBe(obj.rawVariance(0));
    expect(obj.rawStdDev()).toBe(obj.rawStdDev(0));
    expect(obj.rawVariance(0)).toBe(0);
    expect(obj.rawStdDev(0)).toBe(0);
    expect(obj.corVariance(0)).toBe(0);
    expect(obj.corStdDev(0)).toBe(0);
    expect(obj.ineff(0)).toBe(NaN);
  });

  it("two", () => {
    const obj = new BinaryBinner([1, 2]);
    expect(obj.numLayers).toBe(2);
    expect(obj.layer(0)[0]).toBeCloseTo(1);
    expect(obj.layer(0)[1]).toBeCloseTo(2);
    expect(obj.layer(1)[0]).toBeCloseTo(1.5);
    expect(obj.numBins(0)).toBe(2);
    expect(obj.numBins(1)).toBe(1);
    expect(obj.numSamples).toBe(2);
    expect(obj.mean).toBeCloseTo(1.5);
    expect(obj.rawVariance()).toBe(obj.rawVariance(0));
    expect(obj.rawStdDev()).toBe(obj.rawStdDev(0));
    expect(obj.rawVariance(0)).toBe(0.5);
    expect(obj.rawStdDev(0)).toBe(Math.sqrt(0.5));
    expect(obj.rawVariance(1)).toBe(0);
    expect(obj.rawStdDev(1)).toBe(0);
    expect(obj.corVariance(0)).toBeCloseTo(0.25);
    expect(obj.corStdDev(0)).toBeCloseTo(0.5);
    expect(obj.corVariance(1)).toBe(0);
    expect(obj.corStdDev(1)).toBe(0);
    expect(obj.ineff(0)).toBeCloseTo(1);
    expect(obj.ineff(1)).toBeCloseTo(0);
  });

  it("others", () => {
    const obj = new BinaryBinner([0, 1, 2, 3, 4]);
    expect(obj.numLayers).toBe(3);
    expect(obj.layer(0)[0]).toBeCloseTo(0);
    expect(obj.layer(0)[1]).toBeCloseTo(1);
    expect(obj.layer(0)[2]).toBeCloseTo(2);
    expect(obj.layer(0)[3]).toBeCloseTo(3);
    expect(obj.layer(0)[4]).toBeCloseTo(4);
    expect(obj.layer(1)[0]).toBeCloseTo(0.5);
    expect(obj.layer(1)[1]).toBeCloseTo(2.5);
    expect(obj.layer(2)[0]).toBeCloseTo(1.5);
    expect(obj.numBins(0)).toBe(5);
    expect(obj.numBins(1)).toBe(2);
    expect(obj.numBins(2)).toBe(1);
    expect(obj.numSamples).toBe(5);
  });
});
