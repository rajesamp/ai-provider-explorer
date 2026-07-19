import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Content-Security-Policy for the built static app.
// 'unsafe-inline' is required only for style-src because framer-motion writes
// inline style attributes on animated elements; scripts stay 'self' (no inline JS
// in the production bundle). Injected at build time only so the Vite dev server
// (which needs inline/eval for HMR) is not affected. frame-ancestors is delivered
// via public/_headers (meta CSP ignores it) — see docs/SECURITY.md.
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

const cspMetaPlugin = {
  name: 'inject-csp-meta',
  apply: 'build',
  transformIndexHtml() {
    return [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: csp },
        injectTo: 'head-prepend',
      },
    ]
  },
}

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss(), cspMetaPlugin],
  // Vitest transforms JSX via esbuild; the production build uses oxc (plugin-react),
  // so only set the esbuild JSX runtime outside of `build` to avoid a config clash.
  ...(command === 'build' ? {} : { esbuild: { jsx: 'automatic' } }),
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
  },
}))
