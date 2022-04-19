/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

const nextConfig = {
  reactStrictMode: true,
};

const pwa = withPWA({
  pwa: {
    dest: 'public',
  },
});

module.exports = { nextConfig, pwa };
