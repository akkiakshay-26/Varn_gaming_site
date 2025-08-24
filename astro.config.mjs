import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind({
    configFile: './tailwind.config.cjs'
  })],
  site: 'https://example.com' // Replace with your website URL
});