/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  serverExternalPackages: ["sharp"],
  env: {
    NEXT_PUBLIC_BUILD_VERSION: process.env.NEXT_PUBLIC_BUILD_VERSION || "dev",
  },
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

export default withSerwist(config);
