import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig = {
  ...(process.env.NEXT_BUILD_DIR ? { distDir: process.env.NEXT_BUILD_DIR } : {}),
};

export default withPayload(nextConfig);
