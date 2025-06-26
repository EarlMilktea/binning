import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/*.ts"],
  outdir: "dist/src",
  format: "esm",
  banner: { js: "#!/usr/bin/env node" },
});
