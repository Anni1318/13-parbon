import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    runtimeCaching: [
      {
        // Cache API calls (Panjika data) - NetworkFirst
        urlPattern: /^https?.+\/api\/(festivals|pandals).*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 // 24 hours
          },
          networkTimeoutSeconds: 5,
        },
      },
      {
        // Cache Audio files - CacheFirst
        urlPattern: /^https?.+\/audio\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'audio-cache',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
          },
        },
      }
    ]
  }
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withPWA(nextConfig);
