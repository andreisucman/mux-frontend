import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  images: {
    remotePatterns: [
      {
        hostname: "mux.nyc3.cdn.digitaloceanspaces.com",
        pathname: "**",
        protocol: "https",
        port: "",
      },
      {
        hostname: "mux-data.nyc3.cdn.digitaloceanspaces.com",
        pathname: "**",
        protocol: "https",
        port: "",
      },
      {
        hostname: "mux-data.nyc3.digitaloceanspaces.com",
        pathname: "**",
        protocol: "https",
        port: "",
      },
      {
        hostname: "*.media-amazon.com",
        pathname: "**",
        protocol: "https",
        port: "",
      },
    ],
  },
});
