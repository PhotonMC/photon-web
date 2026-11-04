import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// `build` runs the OpenNext build, so OpenNext must call Next directly or it would call itself.
export default { ...defineCloudflareConfig(), buildCommand: "next build" };
