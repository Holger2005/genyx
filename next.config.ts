import type { NextConfig } from "next";

const staticExport = process.env.GENYX_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  ...(staticExport ? { output: "export" as const, images: { unoptimized: true } } : {}),

  turbopack: {
    root: process.cwd(),
  },

  ...(!staticExport && {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "X-Frame-Options",
              value: "DENY",
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=()",
            },
            {
              key: "Content-Security-Policy",
              value:
                "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
            },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
