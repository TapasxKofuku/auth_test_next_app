import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: "script-src 'self' 'unsafe-eval' https://appleid.cdn-apple.com;", // Add this domain
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
