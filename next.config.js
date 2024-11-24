/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  webpack: (config, { isServer }) => {
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
    config.optimization.moduleIds = 'named'
    return config;
  }
};

module.exports = nextConfig;