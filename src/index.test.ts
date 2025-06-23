import { describe, it } from "vitest";
import BinaryBinner from "./index.js";

describe("module entrypoint", () => {
  it("default exports BinaryBinner", () => {
    new BinaryBinner([1, 2, 3]);
  });
});
