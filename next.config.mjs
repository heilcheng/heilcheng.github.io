/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ["i.imgur.com"],
  },
};

export default nextConfig;
