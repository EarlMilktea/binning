import { describe, it } from "vitest";
import BinaryBinner from "./index.js";

describe("package entry point", () => {
  it("default exports BinaryBinner", () => {
    new BinaryBinner([1, 2, 3]);
  });
});
