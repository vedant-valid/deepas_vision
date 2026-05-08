/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['swisseph'],
  outputFileTracingIncludes: {
    '/api/kundli/calculate': ['./node_modules/swisseph/**/*'],
  },
}

export default nextConfig
