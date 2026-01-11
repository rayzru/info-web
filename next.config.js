/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  serverExternalPackages: ["sharp"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sr2.ru",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "beta.sr2.ru",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default config;
