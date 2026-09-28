/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { withSentryConfig } = require("@sentry/nextjs/config");

/** @type {import("next").NextConfig} */
const config = {};

export default withSentryConfig(config, {
  org: "dawid-frankowicz",
  project: "javascript-nextjs",

  silent: !process.env.CI,

  widenClientFileUpload: true,

  webpack: {
    automaticVercelMonitors: true,

    treeshake: {
      removeDebugLogging: true,
    },
  },
});