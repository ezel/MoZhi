const esbuild = require("esbuild");

// 1. 提取公共配置
const sharedConfig = {
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  format: "cjs",
  platform: "node",
  sourcemap: true,
};

async function run() {
  const isWatch = process.argv.includes("--watch");

  if (isWatch) {
    // 2. 开发环境专属配置
    const ctx = await esbuild.context({ ...sharedConfig, minify: false });
    await ctx.watch();
    console.log("🚀 [DEV] 监听模式已启动！");
  } else {
    // 3. 生产环境专属配置
    await esbuild.build({ ...sharedConfig, minify: true });
    console.log("✅ [BUILD] 生产环境构建完成！");
  }
}

run().catch(() => process.exit(1));
