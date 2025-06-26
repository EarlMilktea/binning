import esbuild from "esbuild";

await esbuild.build({
  // Build ESM library modules
  entryPoints: ["src/*.ts"],
  outdir: "dist/src",
  format: "esm",
});

await esbuild.build({
  // Build CJS binary entry point
  entryPoints: ["src/bin.ts"],
  outfile: "dist/src/bin.cjs",
  bundle: true,
  format: "cjs",
  platform: "node",
});
