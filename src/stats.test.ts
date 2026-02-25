import { describe, expect, it } from "vitest";
import { mean, stddev, variance } from "./stats.js";

const RANDOM_ARRAY = [
  0.016_128_713_037_315_93, 0.420_419_353_313_978_34, 0.231_822_187_299_179_03,
  0.807_557_718_568_166_6, 0.909_392_909_418_203_5, -1.399_187_473_019_151_4,
  -0.106_419_619_303_673_11, 0.174_067_446_092_085_44, 0.820_605_634_051_186_7,
  0.224_309_179_229_300_2, 0.246_541_376_557_604_2, -0.846_483_619_479_495_4,
  -1.609_750_851_136_914_3, -0.689_106_591_396_526_9, 1.639_609_980_714_359_1,
  0.407_323_472_500_123_8, -0.577_885_181_147_414_6, 0.839_426_906_647_927_7,
  1.580_126_514_553_166_9, -3.104_278_914_927_669, 1.876_061_259_123_096_5,
  1.576_187_011_506_898_5, -0.586_108_393_299_441_2, -1.324_148_413_727_700_2,
  -0.438_893_139_862_689_6, 0.401_145_778_665_449_5, -0.533_377_945_140_115,
  0.255_597_384_176_022_9, 0.912_734_141_644_634_2, 0.863_452_248_091_918_5,
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
    expect(mean(RANDOM_ARRAY)).toBeCloseTo(0.099_562_302_424_994_21, 9);
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
    expect(variance(RANDOM_ARRAY)).toBeCloseTo(1.185_796_352_743_579_5, 9);
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
    expect(stddev(RANDOM_ARRAY)).toBeCloseTo(1.088_942_768_350_834_6, 9);
  });
});
