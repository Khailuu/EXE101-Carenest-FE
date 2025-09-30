import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Cho phép build chạy ngay cả khi còn lỗi ESLint
    ignoreDuringBuilds: true,
  },
  // Có thể thêm các config khác ở đây nếu cần
};

export default nextConfig;
