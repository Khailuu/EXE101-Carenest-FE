import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  onDemandEntries: {
    // Giữ pages đã compile trong memory lâu hơn
    maxInactiveAge: 15 * 60 * 1000, // 15 phút
    // Số pages được cache đồng thời
    pagesBufferLength: 4,
  },
};

export default nextConfig;
