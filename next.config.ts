import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.convex.cloud',
        port: '',
        pathname: '/api/storage/**',
      },
      {
        protocol: 'https',
        hostname: '*.convex.site',
        port: '',
        pathname: '/getFile**',
      },
      {
        protocol: "https",
        hostname: "files.edgestore.dev", // 팀원이 추가한 domains를 remotePatterns로 변경
        port: "",
        pathname: "/**", // 필요한 모든 경로 허용
      },
    ],
  },
};

export default nextConfig;
