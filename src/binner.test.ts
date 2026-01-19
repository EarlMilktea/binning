import { assert, describe, expect, it } from "vitest";
import BinaryBinner from "./binner.js";

describe("BinaryBinner.binSize", () => {
  it("throws if negative", () => {
    expect(() => BinaryBinner.binSize(-1)).toThrow("non-negative");
  });

  it("returns 2 ** n otherwise", () => {
    expect(BinaryBinner.binSize(0)).toBe(1);
    expect(BinaryBinner.binSize(1)).toBe(2);
    expect(BinaryBinner.binSize(2)).toBe(4);
    expect(BinaryBinner.binSize(3)).toBe(8);
    expect(BinaryBinner.binSize(4)).toBe(16);
  });
});

describe("BinaryBinner", () => {
  it("throws if empty", () => {
    expect(() => new BinaryBinner([])).toThrow("empty");
  });

  it("works with length-one data", () => {
    const v0 = 0.8426132851877524;
    const obj = new BinaryBinner([v0]);
    expect(obj.numLayers).toBe(1);
    expect(obj.layer(0)[0]).toBeCloseTo(v0);
    expect(() => obj.layer(-2)).toThrow("out of bounds");
    expect(obj.numBins(0)).toBe(1);
    expect(obj.numSamples).toBe(1);
    expect(obj.mean).toBeCloseTo(v0);
    expect(obj.rawVariance()).toBe(obj.rawVariance(0));
    expect(obj.rawStdDev()).toBe(obj.rawStdDev(0));
    expect(obj.rawVariance(0)).toBe(0);
    expect(obj.rawStdDev(0)).toBe(0);
    expect(obj.corVariance(0)).toBe(0);
    expect(obj.corStdDev(0)).toBe(0);
    expect(obj.ineff(0)).toBe(NaN);
  });

  it("works with length-two data", () => {
    const v0 = 0.5415983152902303;
    const v1 = -0.09859015451512258;
    const m = (v0 + v1) / 2;
    const mm = (v0 ** 2 + v1 ** 2) / 2;
    const obj = new BinaryBinner([v0, v1]);
    expect(obj.numLayers).toBe(2);
    expect(obj.layer(0)[0]).toBeCloseTo(v0);
    expect(obj.layer(0)[1]).toBeCloseTo(v1);
    expect(obj.layer(1)[0]).toBeCloseTo(m);
    expect(obj.numBins(0)).toBe(2);
    expect(obj.numBins(1)).toBe(1);
    expect(obj.numSamples).toBe(2);
    expect(obj.mean).toBeCloseTo(m);
    expect(obj.rawVariance()).toBe(obj.rawVariance(0));
    expect(obj.rawStdDev()).toBe(obj.rawStdDev(0));
    expect(obj.rawVariance(0)).toBeCloseTo(2 * (mm - m ** 2));
    expect(obj.rawStdDev(0)).toBeCloseTo(Math.sqrt(2 * (mm - m ** 2)));
    expect(obj.rawVariance(1)).toBe(0);
    expect(obj.rawStdDev(1)).toBe(0);
    expect(obj.corVariance(0)).toBeCloseTo(mm - m ** 2);
    expect(obj.corStdDev(0)).toBeCloseTo(Math.sqrt(mm - m ** 2));
    expect(obj.corVariance(1)).toBe(0);
    expect(obj.corStdDev(1)).toBe(0);
    expect(obj.ineff(0)).toBeCloseTo(1);
    expect(obj.ineff(1)).toBeCloseTo(0);
  });

  it("is also fine otherwise", () => {
    const vs = [
      1.0144754061862316, -0.3524689024770206, -0.11764670726425461,
      -0.42722502116722094, 0.2671235820213575,
    ] as const;
    const [v0, v1, v2, v3, v4] = vs;
    const obj = new BinaryBinner(vs);
    expect(obj.numLayers).toBe(3);
    expect(obj.layer(0)[0]).toBeCloseTo(v0);
    expect(obj.layer(0)[1]).toBeCloseTo(v1);
    expect(obj.layer(0)[2]).toBeCloseTo(v2);
    expect(obj.layer(0)[3]).toBeCloseTo(v3);
    expect(obj.layer(0)[4]).toBeCloseTo(v4);
    expect(obj.layer(1)[0]).toBeCloseTo((v0 + v1) / 2);
    expect(obj.layer(1)[1]).toBeCloseTo((v2 + v3) / 2);
    expect(obj.layer(2)[0]).toBeCloseTo((v0 + v1 + v2 + v3) / 4);
    expect(obj.numBins(0)).toBe(5);
    expect(obj.numBins(1)).toBe(2);
    expect(obj.numBins(2)).toBe(1);
    expect(obj.numSamples).toBe(5);
  });

  it("works with iterators", () => {
    const arr = [0.1, 0.2, 0.3, 0.4, 0.5] as const;
    const ref = new BinaryBinner(arr);
    const cmp = new BinaryBinner(arr.values());
    assert.deepEqual(cmp, ref);
  });
});
