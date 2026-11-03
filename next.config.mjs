/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Netlify's Next.js adapter manages its own server output. Keep standalone
  // output for Docker deployments such as Google Cloud Run.
  ...(process.env.NETLIFY ? {} : { output: 'standalone' }),
};
export default nextConfig;
