import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// `build` runs the OpenNext build, so OpenNext must call Next directly or it would call itself.
const config = { ...defineCloudflareConfig(), buildCommand: "next build" };

export default config;
