import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { app, parseArgs } from "./cli.js";

describe("parseArgs", () => {
  it("throws if --row and --col are both specified", () => {
    expect(() => parseArgs(["--row", "1", "--col", "2"])).toThrow(
      "at the same time",
    );
  });

  it("works with --row", () => {
    expect(parseArgs(["--row", "1", "-i", "hoge"])).toEqual({
      src: "hoge",
      op: { target: "row", index: 1 },
    });
  });

  it("works with --col", () => {
    expect(parseArgs(["--col", "2", "-o", "fuga"])).toEqual({
      dst: "fuga",
      op: { target: "col", index: 2 },
    });
  });
});

describe("app", () => {
  it("works", async () => {
    const work = await fs.mkdtemp("binning-test-");
    let output: string;
    try {
      const src = path.join(work, "input.txt");
      const dst = path.join(work, "output.txt");
      await fs.writeFile(src, "1, 2\n3, 4\n");
      await app({
        src,
        dst,
        op: { target: "row", index: 1 },
      });
      output = await fs.readFile(dst, { encoding: "utf-8" });
    } finally {
      await fs.rm(work, { recursive: true });
    }
    // HACK: Only check total-mean
    const ret = JSON.parse(output) as { "total-mean": number };
    expect(ret["total-mean"]).toBeCloseTo(3.5);
  });
});
