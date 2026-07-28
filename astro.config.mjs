// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';
import node from '@astrojs/node';

import react from '@astrojs/react';

const isVercel = process.env.BUILD_TARGET === 'vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  security: {
    checkOrigin: false
  },
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: isVercel ? vercel() : node({ mode: 'standalone' }),
  integrations: [react()]
});