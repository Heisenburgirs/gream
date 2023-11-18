/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');
dotenv.config();

const nextConfig = {
    images: {
    domains: ['pbs.twimg.com'],
  },}

module.exports = nextConfig
