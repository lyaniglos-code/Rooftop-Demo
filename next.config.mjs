/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — the whole demo is client-rendered, so `next build` emits
  // plain HTML/CSS/JS into ./out, deployable to any static host (Render
  // Static Site, free tier, no server to sleep).
  output: "export",
  // Every route exports as folder/index.html, so paths resolve on any static
  // host without server-side rewrites.
  trailingSlash: true,
};

export default nextConfig;
