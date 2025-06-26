import esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";

const src = fs
  .readdirSync("src")
  .filter((f) => f.endsWith(".ts") && !f.endsWith("test.ts"))
  .map((f) => path.join("src", f));

await esbuild.build({
  entryPoints: src,
  outdir: "dist/src",
  format: "esm",
  banner: { js: "#!/usr/bin/env node" },
});
