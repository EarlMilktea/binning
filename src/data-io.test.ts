import { describe, expect, it } from "vitest";
import { asMatrix } from "./data-io.js";

describe("asMatrix", () => {
  it("valid", () => {
    expect(
      asMatrix([
        [1, 2],
        [3, 4],
      ]),
    ).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });
});
