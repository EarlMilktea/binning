import esbuild from "esbuild";
import fs from "node:fs/promises";

const src: string[] = [];

for await (const f of fs.glob("src/**/*.ts")) {
  if (f.endsWith("test.ts")) {
    continue;
  }
  src.push(f);
}

await esbuild.build({
  entryPoints: src,
  outdir: "dist/src",
  format: "esm",
  banner: { js: "#!/usr/bin/env node" },
});
