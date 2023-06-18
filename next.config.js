/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    largePageDataBytes: 128 * 1000 * 5,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        port: '',
        pathname: '/avatar/**',
      },
    ],
  },
};

module.exports = nextConfig;
