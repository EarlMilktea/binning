import { describe, expect, it } from "vitest";
import { mean, stddev, variance } from "./stats.js";

const RANDOM_ARRAY = [
  0.01612871303731593, 0.42041935331397834, 0.23182218729917903,
  0.8075577185681666, 0.9093929094182035, -1.3991874730191514,
  -0.10641961930367311, 0.17406744609208544, 0.8206056340511867,
  0.2243091792293002, 0.2465413765576042, -0.8464836194794954,
  -1.6097508511369143, -0.6891065913965269, 1.6396099807143591,
  0.4073234725001238, -0.5778851811474146, 0.8394269066479277,
  1.5801265145531669, -3.104278914927669, 1.8760612591230965,
  1.5761870115068985, -0.5861083932994412, -1.3241484137277002,
  -0.4388931398626896, 0.4011457786654495, -0.533377945140115,
  0.2555973841760229, 0.9127341416446342, 0.8634522480919185,
] as const;

describe("mean", () => {
  it("returns 0 if empty", () => {
    expect(mean([])).toBe(0);
  });

  it("returns mean otherwise", () => {
    expect(mean([1])).toBeCloseTo(1);
    expect(mean([2, 3])).toBeCloseTo(2.5);
    expect(mean([1, 2, 3])).toBeCloseTo(2);
  });

  it("is consistent with numpy", () => {
    expect(mean(RANDOM_ARRAY)).toBeCloseTo(0.09956230242499421, 9);
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

  it("is consistent with numpy", () => {
    expect(variance(RANDOM_ARRAY)).toBeCloseTo(1.1857963527435795, 9);
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

  it("is consistent with numpy", () => {
    expect(stddev(RANDOM_ARRAY)).toBeCloseTo(1.0889427683508346, 9);
  });
});
