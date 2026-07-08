import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // URL pública del sitio — necesaria para generar el sitemap con URLs absolutas
  site: 'https://jm-consulting-foods.netlify.app',
  integrations: [sitemap()],
});
