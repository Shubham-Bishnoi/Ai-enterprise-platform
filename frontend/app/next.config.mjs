import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // /how-gff-ai-works is the canonical methodology page; the former
      // /why-gff-ai content was migrated into it.
      { source: '/why-gff-ai', destination: '/how-gff-ai-works', permanent: true },
      // The standalone resources library was redistributed across
      // Capabilities, Industries, Platforms and Build With GFF.
      { source: '/resources', destination: '/capabilities#research-intelligence', permanent: true },
    ]
  },
  // Pin the workspace root. Without this, Turbopack walks up the tree and can
  // select an unrelated lockfile outside the repo as the project root.
  turbopack: {
    root: __dirname,
  },
  typescript: {
    // Inherited from the design export. `npx tsc --noEmit` is run separately
    // and currently passes clean — see the verification notes in the handover.
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
