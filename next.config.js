/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-private-methods']
        }
      }
    });
    return config;
  }
};

module.exports = nextConfig;